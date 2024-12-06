/* -*- P4_16 -*- */
#include <core.p4>
#include <v1model.p4>



const bit<16> TYPE_IPV4 = 0x800;
const bit<16> TYPE_GEO = 0x8947;
const bit<4> TYPE_geo_beacon = 0x0001;
const bit<4> TYPE_geo_gbc = 0x0004;     
const bit<4> TYPE_geo_shb = 0x0005; 

const bit<9> PORT_ONOS =255;
const bit<9> PORT_BIT_MCAST =254;
typedef bit<64>  mcast_group_id_t;


/*************************************************************************
*********************** H E A D E R S  ***********************************
*************************************************************************/

header ethernet_t {
    bit<48> dstAddr;
    bit<48> srcAddr;
    bit<16> etherType;
}


header ipv4_t {
    bit<8>  versionIhl;
    bit<8>  diffserv;
    bit<16> totalLen;
    bit<16> identification;
    bit<16> fragOffset;
    bit<8>  ttl;
    bit<8>  protocol;
    bit<16> hdrChecksum;
    bit<32> srcAddr;
    bit<32> dstAddr;
}



header geo_t{
    bit<4>  version;
    bit<4>  nh_basic;
    bit<8>  reserved_basic;
    bit<8>  lt;
    bit<8>  rhl;
    bit<4> nh_common;
    bit<4> reserved_common_a;
    bit<4> ht;
    bit<4> hst;
    bit<8> tc;
    bit<8> flag;
    bit<16> pl;
    bit<8> mhl;
    bit<8> reserved_common_b;
}

header gbc_t{
    bit<16> sn;
    bit<16> reserved_gbc_a;
    bit<64> gnaddr;
    bit<32> tst;
    bit<32> lat;
    bit<32> longg;
    bit<1> pai;
    bit<15> s;
    bit<16> h;
    bit<32> geoAreaPosLat; //请求区域中心点的维度
    bit<32> geoAreaPosLon; //请求区域中心点的经度
    bit<16> disa;
    bit<16> disb;
    bit<16> angle;
    bit<16> reserved_gbc_b; 
}
header btp_t{
    bit<16> dstport;
    bit<16> dstportinfo;
}

header its_t{
    bit<8> protoversion;
    bit<8> messid;
    bit<32> stationid;
}


header beacon_t{
    bit<64> gnaddr;
    bit<32> tst;
    bit<32> lat;
    bit<32> longg;
    bit<1> pai;
    bit<15> s;
    bit<16> h;
    //是否可以在header中使用结构体
}

header shb_t{
    bit<8> code;
}

@controller_header("packet_in")
header onos_in_header_t {
    bit<9>  ingress_port;
    bit<7>      _pad;
}

@controller_header("packet_out")
header onos_out_header_t {
    bit<9>  egress_port;
    bit<7>      _pad;
}


struct headers{
    onos_out_header_t onos_out;
    onos_in_header_t onos_in;
    ethernet_t ethernet;
    ipv4_t ipv4;
    geo_t geo;
    gbc_t gbc;
    beacon_t beacon;
    shb_t shb;
    btp_t btp;
    its_t its;
    
}

struct metadata {
    /* empty */
}

/*************************************************************************
*********************** P A R S E R  ***********************************
*************************************************************************/

parser MyParser(packet_in packet,
                out headers hdr,
                inout metadata meta,
                inout standard_metadata_t standard_metadata) {


    state start {
        transition select(standard_metadata.ingress_port){
            PORT_ONOS: parse_packet_out;
            default: parse_ethernet;
        }
    }

    state parse_packet_out {
        packet.extract(hdr.onos_out);
        transition parse_ethernet;
    }

    state parse_ethernet {
        packet.extract(hdr.ethernet);
        transition select(hdr.ethernet.etherType) { 
            TYPE_IPV4: parse_ipv4;
            TYPE_GEO: parse_geo;
            default: accept;
        }
    }

    state parse_ipv4{
        packet.extract(hdr.ipv4);
        transition accept;
    }


    state parse_geo{
        packet.extract(hdr.geo);
        transition select(hdr.geo.ht) { //要根据ht的大小来判断选取的字段
            TYPE_geo_beacon: parse_beacon; //0x01
            TYPE_geo_gbc: parse_gbc;       //0x04
            TYPE_geo_shb: parse_shb;  //0x05  
            default: accept;
        }
    }

    state parse_beacon{
        packet.extract(hdr.beacon);
        transition accept;
    }

    state parse_gbc{
        packet.extract(hdr.gbc);
        transition parse_btp;
    }

    state parse_btp{
        packet.extract(hdr.btp);
        transition parse_its;
    }
    
    state parse_its{
        packet.extract(hdr.its);
        transition accept;
    }

    state parse_shb{
        packet.extract(hdr.shb);
        transition accept;
    }
    
}

/*************************************************************************
************   C H E C K S U M    V E R I F I C A T I O N   *************
*************************************************************************/
control verifyChecksum(inout headers hdr, inout metadata meta) {
    apply {
    }
}

/*************************************************************************
**************  I N G R E S S   P R O C E S S I N G   *******************
*************************************************************************/

control MyIngress(inout headers hdr,
                  inout metadata meta,
                  inout standard_metadata_t standard_metadata) {


    action unicast(bit<9> port) {
        standard_metadata.egress_spec = port;
    }



    action drop() {
        mark_to_drop(standard_metadata);
    }


    action multicast(mcast_group_id_t grpid) {
        standard_metadata.mcast_grp = grpid;
        meta.is_multicast = true;
        standard_metadata.egress_spec = PORT_BIT_MCAST;
        //standard_metadata.bit_mcast = bitcast;
    }//用于组播的动作函数

    table gbc_exact {
        actions = {
            multicast;//这是新加的动作
            unicast;
        }
        key = {
            hdr.gbc.geoAreaPosLat: exact;
            hdr.gbc.geoAreaPosLon: exact;
            hdr.gbc.disa: exact;
            hdr.gbc.disb: exact;
            hdr.its.stationid: exact;
        }
        size = 1024;
        default_action = drop();
    }

    table shb_tbl {
        actions = {
            unicast;
        }
        key = {
            
        }
        size = 1024;
    }




    apply {
        
        if (hdr.gbc.isValid()) {
            gbc_exact.apply();
        }
        else if(hdr.shb.isValid()){
            shb_tbl.apply();
        }
        
    }
}

/*************************************************************************
****************  E G R E S S   P R O C E S S I N G   *******************
*************************************************************************/

control MyEgress(inout headers hdr,
                 inout metadata meta,
                 inout standard_metadata_t standard_metadata) {

    action drop() {
        mark_to_drop(standard_metadata);
    }

    apply {
        if (standard_metadata.egress_port == PORT_ONOS) {
            hdr.onos_in.setValid();
            hdr.onos_in.ingress_port = standard_metadata.ingress_port;
            hdr.onos_in._pad = 7w0;
            exit;
        }
        if (standard_metadata.egress_port == standard_metadata.ingress_port)
            drop();
    }
}

/*************************************************************************
*************   C H E C K S U M    C O M P U T A T I O N   **************
*************************************************************************/
control computeChecksum(inout headers hdr, inout metadata meta) {
    apply {
    }
}

/*************************************************************************
***********************  D E P A R S E R  *******************************
*************************************************************************/

control MyDeparser(packet_out packet, in headers hdr) {
        apply{
            packet.emit(hdr);
        }
}



/*************************************************************************
***********************  S W I T C H  *******************************
*************************************************************************/

V1Switch(
MyParser(),
verifyChecksum(),
MyIngress(),
MyEgress(),
computeChecksum(),
MyDeparser()
) main;

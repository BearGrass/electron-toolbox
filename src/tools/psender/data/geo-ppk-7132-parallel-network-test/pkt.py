import os
import yaml
from scapy.all import Ether, Dot1Q, struct, Packet, XShortField, ShortField, BitField


class Setting:
    def __init__(self, count= 1, inter= 0) -> None:
        self.count = count
        self.inter = inter

class GEO(Packet):
    name = "GEO"
    """
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
    """
    fields_desc = [
        BitField("version", 0x0, 4),
        BitField("nh_basic", 0x0, 4),
        BitField("reserved_basic", 0x0, 8),
        BitField("lt", 0x0, 8),
        BitField("rhl", 0x0, 8),
        BitField("nh_common", 0x0, 4),
        BitField("reserved_common_a", 0x0, 4),
        BitField("ht", 0x0, 4),
        BitField("hst", 0x0, 4),
        BitField("tc", 0x0, 8),
        BitField("flag", 0x0, 8),
        BitField("pl", 0x0, 16),
        BitField("mhl", 0x0, 8),
        BitField("reserved_common_b", 0x0, 8)
    ]

    def __init__(self, version=0x0, nh_basic=0x0, reserved_basic=0x0, lt=0x0, rhl=0x0, 
                 nh_common=0x0, reserved_common_a=0x0, ht=0x0, hst=0x0, tc=0x0, flag=0x0, 
                 pl=0x0, mhl=0x0, reserved_common_b=0x0, **kwargs):
        # 调用父类的__init__
        super().__init__(**kwargs)
        # 设置字段值
        self.fields['version'] = version
        self.fields['nh_basic'] = nh_basic
        self.fields['reserved_basic'] = reserved_basic
        self.fields['lt'] = lt
        self.fields['rhl'] = rhl
        self.fields['nh_common'] = nh_common
        self.fields['reserved_common_a'] = reserved_common_a
        self.fields['ht'] = ht
        self.fields['hst'] = hst
        self.fields['tc'] = tc
        self.fields['flag'] = flag
        self.fields['pl'] = pl
        self.fields['mhl'] = mhl
        self.fields['reserved_common_b'] = reserved_common_b

class BEACON(Packet):
    name = "BEACON"
    """
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
    """
    fields_desc = [
        BitField("gnaddr", 0x0000000000000000, 64),
        BitField("tst", 0x00000000, 32),
        BitField("lat", 0x00000000, 32),
        BitField("longg", 0x00000000, 32),
        BitField("pai", 0x0, 1),
        BitField("s", 0x0, 15),
        BitField("h", 0x0, 16)
    ]

    def __init__(self, gnaddr=0x0000000000000000, tst=0x00000000, lat=0x00000000, longg=0x00000000, pai=0x0, s=0x0, h=0x0, **kwargs):
        # 调用父类的__init__
        super().__init__(**kwargs)
        # 设置字段值
        self.fields['gnaddr'] = gnaddr
        self.fields['tst'] = tst
        self.fields['lat'] = lat
        self.fields['longg'] = longg
        self.fields['pai'] = pai
        self.fields['s'] = s
        self.fields['h'] = h

class GBC(Packet):
    name = "GBC"
    """
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
    """
    fields_desc = [
        BitField("sn", 0x0000, 16),
        BitField("reserved_gbc_a", 0x0000, 16),
        BitField("gnaddr", 0x0000000000000000, 64),
        BitField("tst", 0x00000000, 32),
        BitField("lat", 0x00000000, 32),
        BitField("longg", 0x00000000, 32),
        BitField("pai", 0x0, 1),
        BitField("s", 0x0, 15),
        BitField("h", 0x0, 16),
        BitField("geoAreaPosLat", 0x00000000, 32),
        BitField("geoAreaPosLon", 0x00000000, 32),
        BitField("disa", 0x0000, 16),
        BitField("disb", 0x0000, 16),
        BitField("angle", 0x0000, 16),
        BitField("reserved_gbc_b", 0x0000, 16),
        BitField("dstport", 0x0000, 16),
        BitField("dstportinfo", 0x0000, 16),
        BitField("protoversion", 0x00, 8),
        BitField("messid", 0x00, 8),
        BitField("stationid", 0x00000000, 32)
    ]

    def __init__(self, sn=0x0000, reserved_gbc_a=0x0000, gnaddr=0x0000000000000000, tst=0x00000000, 
                 lat=0x00000000, longg=0x00000000, pai=0x0, s=0x0, h=0x0, geoAreaPosLat=0x00000000, 
                 geoAreaPosLon=0x00000000, disa=0x0000, disb=0x0000, angle=0x0000, reserved_gbc_b=0x0000, 
                 dstport=0x0000, dstportinfo=0x0000, protoversion=0x00, messid=0x00, stationid=0x00000000, **kwargs):
        # 调用父类的__init__
        super().__init__(**kwargs)
        # 设置字段值
        self.fields['sn'] = sn
        self.fields['reserved_gbc_a'] = reserved_gbc_a
        self.fields['gnaddr'] = gnaddr
        self.fields['tst'] = tst
        self.fields['lat'] = lat
        self.fields['longg'] = longg
        self.fields['pai'] = pai
        self.fields['s'] = s
        self.fields['h'] = h
        self.fields['geoAreaPosLat'] = geoAreaPosLat
        self.fields['geoAreaPosLon'] = geoAreaPosLon
        self.fields['disa'] = disa
        self.fields['disb'] = disb
        self.fields['angle'] = angle
        self.fields['reserved_gbc_b'] = reserved_gbc_b
        self.fields['dstport'] = dstport
        self.fields['dstportinfo'] = dstportinfo
        self.fields['protoversion'] = protoversion
        self.fields['messid'] = messid
        self.fields['stationid'] = stationid

class SHB(Packet):
    name = "SHB"
    """
    header shb_t{
    bit<8> code;
    }
    """

    def __init__(self, code=0x00, **kwargs):
        # 调用父类的__init__
        super().__init__(**kwargs)
        # 设置字段值
        self.fields['code'] = code

def singleton(cls):
    instances = {}
    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    return get_instance

@singleton
class Case:
    cases = []
    setting = []
    def append(self, data, setting):
        self.cases.append(data)
        if setting is None:
            setting = Setting()
        self.setting.append(setting)

    def load_cases_from_yaml(self, yaml_file="case.yml"):
        current_dir = os.path.dirname(os.path.abspath(__file__))
        yaml_path = os.path.join(current_dir, yaml_file)
        try:
            with open(yaml_path, 'r') as f:
                data = yaml.safe_load(f)
            for case in data['cases']:
                eth = Ether(
                    src=case['ether']['src'],
                    dst=case['ether']['dst'],
                    type=case['ether']['type']
                )
                geo = GEO(
                    ht=case['geo']['ht'],
                )
                gbc = GBC(
                    stationid=case['gbc']['stationid'],
                    geoAreaPosLat=case['gbc']['geoAreaPosLat'],
                    geoAreaPosLon=case['gbc']['geoAreaPosLon'],
                    disa=case['gbc']['disa'],
                    disb=case['gbc']['disb']
                )
                setting = Setting(
                    count=case['setting']['count'],
                    inter=case['setting']['inter']
                )
                data = (eth/geo/gbc)
                self.cases.append(data)
                self.setting.append(setting)
        except FileNotFoundError:
            print(f"Error: Cannot find {yaml_file} in {current_dir}")
        except Exception as e:
            print(f"Error loading YAML file: {str(e)}")

            

    def get_case(self):
        return self.cases
    def get_setting(self):
        return self.setting
    
    def __init__(self) -> None:
        self.load_cases_from_yaml()
document.querySelectorAll('input[name="protocolType"]').forEach(radio => {
    //default use predefined protocol
    document.getElementById('customProtocol').style.display = 'none';
    radio.addEventListener('change', function () {
        document.getElementById('predefinedProtocol').style.display =
            this.value === 'predefined' ? 'block' : 'none';
        document.getElementById('customProtocol').style.display =
            this.value === 'custom' ? 'block' : 'none';
    });
});

const addProtocolField = document.getElementById('addProtocolField');
addProtocolField.addEventListener('click', function () {
    const div = document.createElement('div');
    div.className = 'protocol-field';

    const descInput = document.createElement('input');
    descInput.type = 'text';
    descInput.placeholder = '报文头描述';

    const bitInput = document.createElement('input');
    bitInput.type = 'number';
    bitInput.placeholder = '报文头bit数';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '删除';
    deleteBtn.onclick = function () {
        div.remove();
    };

    div.appendChild(descInput);
    div.appendChild(bitInput);
    div.appendChild(deleteBtn);

    document.getElementById('protocolFields').appendChild(div);
});

const generateOutput = document.getElementById('generateOutput');
const protocol_output = document.getElementById('protocol-output');
generateOutput.addEventListener('click', async function () {
    const protocolType = document.querySelector('input[name="protocolType"]:checked').value;
    let protocol_arg = '';
    if (protocolType === 'predefined') {
        protocol_arg = document.getElementById('protocolSelect').value;
    } else {
        const fields = document.querySelectorAll('.protocol-field');
        let seg = 0;
        fields.forEach(field => {
            const desc = field.children[0].value;
            const bits = field.children[1].value;
            if (desc && bits) {
                if (seg == 0) {
                    protocol_arg = `${desc}:${bits}`;
                } else {
                    protocol_arg += `,${desc}:${bits}`;
                }
                seg += 1;
            }
        });
    }
    
    try {
        console.log('protocol_arg:', protocol_arg);
        const { output_text, error } = await backend.runPython(['protocol', protocol_arg]);
        console.log('output_text:', output_text);
        if (protocol_output) {
            protocol_output.innerHTML = output_text || '没有输出';
        } else {
            console.error('找不到输出元素');
        }
        if (error) {
            console.log('error:', error);
        }
    } catch (err) {
        console.error('执行出错:', err);
        if (protocol_output) {
            protocol_output.innerHTML = '执行出错，请查看控制台';
        }
    }  
});
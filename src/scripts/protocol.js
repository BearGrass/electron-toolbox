// 使用立即执行函数表达式(IIFE)来避免变量污染全局作用域
(function() {
    // 初始化函数
    function initProtocolScript() {
        // 处理协议类型选择
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

        // 添加协议字段
        const addProtocolField = document.getElementById('addProtocolField');
        if (addProtocolField) {
            // 移除可能存在的旧事件监听器
            addProtocolField.removeEventListener('click', handleAddField);
            // 添加新的事件监听器
            addProtocolField.addEventListener('click', handleAddField);
        }

        // 生成输出
        const generateOutput = document.getElementById('generateOutput');
        const protocol_output = document.getElementById('protocol-output');
        if (generateOutput) {
            // 移除可能存在的旧事件监听器
            generateOutput.removeEventListener('click', handleGenerateOutput);
            // 添加新的事件监听器
            generateOutput.addEventListener('click', handleGenerateOutput);
        }
    }

    // 处理添加字段的函数
    function handleAddField() {
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
    }

    // 处理生成输出的函数
    async function handleGenerateOutput() {
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
        
        const protocol_output = document.getElementById('protocol-output');
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
    }

    // 初始化脚本
    initProtocolScript();

    // 如果需要从外部访问这些函数，可以将它们添加到 window 对象
    window.initProtocolScript = initProtocolScript;
})();
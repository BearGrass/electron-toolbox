const protocol = document.getElementById('protocol');
const output_text = document.getElementById('protocol_output'); // 先声明输出元素

protocol.onclick = async (e) => {
    e.preventDefault(); // 阻止表单默认提交行为
    
    const protocol_input = document.getElementById('protocol_input');
    console.log(protocol_input.value);

    try {
        const { output, error } = await backend.runPython(['protocol', protocol_input.value]);
        if (output_text) {
            output_text.innerHTML = output || '没有输出';
        } else {
            console.error('找不到输出元素');
        }
        if (error) {
            console.log('error:', error);
        }
    } catch (err) {
        console.error('执行出错:', err);
        if (output_text) {
            output_text.innerHTML = '执行出错，请查看控制台';
        }
    }
}
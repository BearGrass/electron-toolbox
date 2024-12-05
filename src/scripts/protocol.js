const protocol = document.getElementById('protocol');

protocol.onclick = async () => {
    const protocol_input = document.getElementById('protocol_input');
    console.log(protocol_input.value);

    const { output, error } = await backend.runPython(['protocol', protocol_input.value]);
    output_text = document.getElementById('protocol_output');
    output_text.innerHTML = output;
    console.log('error:', error);
}



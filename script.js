document.addEventListener('DOMContentLoaded', () => {
    const URL = "https://teachablemachine.withgoogle.com/models/-MLC1ZB5g/";
    let model, recognizer;

    async function createModel() {
        const checkpointURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        recognizer = speechCommands.create("BROWSER_FFT", undefined, checkpointURL, metadataURL);
        await recognizer.ensureModelLoaded();
        return recognizer;
    }

    function updateResults(result) {
        const scores = result.scores;
        const classLabels = recognizer.wordLabels();
        const labelContainer = document.getElementById("label-container");
        const imageElement = document.getElementById('stageImage');

        // 결과 컨테이너 초기화
        labelContainer.innerHTML = '';
        let stopRecording = false;

        // 각 레이블 및 스코어 출력
        classLabels.forEach((label, i) => {
            const classPrediction = label + ": " + scores[i].toFixed(2);
            labelContainer.innerHTML += '<div>' + classPrediction + '</div>'; // 예측 결과 출력

            if (scores[i] > 0.8) {
                if (label === 'Class 2') {
                    window.location.href = 'first.html'; // 페이지 리디렉션
                    stopRecording = true;
                } else if (label === 'Class 3') {
                    document.getElementById('result').innerHTML = '2단계';
                    imageElement.src = 'image/b.jpg';
                    imageElement.style.display = 'block';
                    stopRecording = true;
                }
            }
        });

        if (stopRecording) {
            recognizer.stopListening();
            document.getElementById('status').innerHTML = "녹음 완료";
            document.getElementById('status').className = 'stopped';
        }
    }

    document.getElementById('startImage').addEventListener('click', async () => {
        const statusElement = document.getElementById('status');
        statusElement.innerHTML = "녹음 중...";
        statusElement.className = 'recording';

        if (!recognizer) {
            recognizer = await createModel();
        }
        recognizer.listen(updateResults, {
            includeSpectrogram: true,
            probabilityThreshold: 0.75,
            invokeCallbackOnNoiseAndUnknown: true,
            overlapFactor: 0.50
        });
    });
});

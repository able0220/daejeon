let model, webcam, maxPredictions, labelContainer, indicatorCircles;

async function predict() {
    const prediction = await model.predict(webcam.canvas);

    // 모든 원을 초기 회색으로 설정
    indicatorCircles.forEach(circle => {
        circle.style.backgroundColor = "grey";
    });

    // 예측된 각 클래스의 확률에 따라 불이 들어오는 원의 개수를 설정
    for (let i = 0; i < maxPredictions; i++) {
        const probability = prediction[i].probability.toFixed(2);
        const classPrediction = prediction[i].className + ": " + probability;
        labelContainer.children[i].innerHTML = classPrediction;

        // 각 클래스별 확률이 0.2, 0.4, 0.6, 0.8, 0.95 이상일 때 각각에 해당하는 원에 파란색 불이 들어오도록 설정
        if (prediction[0].probability.toFixed(2) >= 0.95) {
            indicatorCircles[0].style.backgroundColor = "blue";
            indicatorCircles[1].style.backgroundColor = "blue";
            indicatorCircles[2].style.backgroundColor = "blue";
            indicatorCircles[3].style.backgroundColor = "blue";
            indicatorCircles[4].style.backgroundColor = "blue";



        } else if (prediction[0].probability.toFixed(2) >= 0.8) {

            indicatorCircles[0].style.backgroundColor = "blue";
            indicatorCircles[1].style.backgroundColor = "blue";
            indicatorCircles[2].style.backgroundColor = "blue";
            indicatorCircles[3].style.backgroundColor = "blue";
        } else if (prediction[0].probability.toFixed(2) >= 0.6) {
            indicatorCircles[0].style.backgroundColor = "blue";
            indicatorCircles[1].style.backgroundColor = "blue";
            indicatorCircles[2].style.backgroundColor = "blue";
            indicatorCircles[3].style.backgroundColor = "blue";

        } else if (prediction[0].probability.toFixed(2) >= 0.4) {
            indicatorCircles[1].style.backgroundColor = "blue";
            indicatorCircles[0].style.backgroundColor = "blue";
        } else if (prediction[0].probability.toFixed(2) >= 0.2) {
            indicatorCircles[0].style.backgroundColor = "blue";
        }
    }
}

async function init() {
    const modelURL = 'https://teachablemachine.withgoogle.com/models/PD8-ZQK3r/model.json';
    const metadataURL = 'https://teachablemachine.withgoogle.com/models/PD8-ZQK3r/metadata.json';

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true;
    webcam = new tmImage.Webcam(640, 480, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    document.getElementById('webcam-container').appendChild(webcam.canvas);
    labelContainer = document.getElementById('label-container');

    // labelContainer 내에 각 클래스의 라벨을 동적으로 생성
    for (let i = 0; i < maxPredictions; i++) {
        const div = document.createElement('div');
        labelContainer.appendChild(div);
    }

    // 원들의 DOM 요소를 가져와서 indicatorCircles에 할당
    indicatorCircles = document.querySelectorAll('.circle');
}

function loop() {
    webcam.update(); // 웹캠 업데이트
    predict(); // 예측 실행
    window.requestAnimationFrame(loop); // 반복 실행
}

document.addEventListener('DOMContentLoaded', init);

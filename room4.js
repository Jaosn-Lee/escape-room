let newX = 0, newY = 0, startX = 0, startY = 0;

const big_button = document.getElementById('big_button');

big_button.addEventListener('mousedown', mouseDown);

function mouseDown(e) { // Missing parenthesis here
    startX = e.clientX;
    startY = e.clientY;

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
}

function mouseMove(e) {
    newX = startX - e.clientX;
    newY = startY - e.clientY;

    startX = e.clientX;
    startY = e.clientY;

    big_button.style.top = (big_button.offsetTop - newY) + 'px';
    big_button.style.left = (big_button.offsetLeft - newX) + 'px';
}

function mouseUp(e) {
    document.removeEventListener('mousemove', mouseMove);
}
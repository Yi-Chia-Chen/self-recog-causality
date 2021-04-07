const LINE_LENGTH = 300;
const LINE_HEIGHT = 66.641; //read from console
const DISK_SIZE = 40;
const START_BUT_SIZE = 10;

function SETUP_TRACING_INTERFACE() {
    $('#tracing').css('transform', 'translateY(-' + LINE_HEIGHT / 2 + 'px');
    $('#line img').css('width', LINE_LENGTH + 'px');
    $('#disk').css({'display': 'block',
                    'width': DISK_SIZE + 'px',
                    'height': DISK_SIZE + 'px',
                'transform': 'translate(' + LINE_LENGTH / 2 + 'px, ' + (LINE_HEIGHT - DISK_SIZE / 2) + 'px)'});

    $('#start').css({'display': 'block',
                    'width': START_BUT_SIZE + 'px',
                    'height': START_BUT_SIZE + 'px',
                    'transform': 'translate(-' + (LINE_LENGTH + START_BUT_SIZE) / 2 + 'px, ' + (LINE_HEIGHT - START_BUT_SIZE / 2) + 'px)'});
}

function SETUP_TRACING_CANVAS() {
    var ctx = $('#canvas').getContext('2d');
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'red';
}

function START_BUT_DISAPPEAR() {
    $('#start').hide();
}

function MOVE_DISK(){
    $('#disk').css({'transform': 'translate(' + (LINE_LENGTH / 2 + 1000) + 'px, ' + (LINE_HEIGHT - DISK_SIZE / 2) + 'px)',
                    'transition': DISK_SPEED + 's'});
}

function HIDE_CURSOR() {
    $('body').css('cursor', 'none');
}

function SHOW_CURSOR() {
    $('body').css('cursor', 'default');
}

function SHOW_TRACING_NEXT_BUT() {
    $('#tracingNextBut').show();
}

function SHOW_RECOGNITION_NEXT_BUT() {
    $('#recognitionNextBut').show();
}

function SHOW_INTRO() {
    $('#intro').show();
    $('#recognitionNextBut').show();
}

function SHOW_TRACING_TASK() {
    $('#intro').hide();
    $('#recognitionNextBut').hide();
    $('#recognition').hide();
    RESET_RECOGNITION_TASK();
    $('#tracing').show();
}

function RESET_RECOGNITION_TASK() {
    $('input[name="recognition"]').prop('checked', false);
}

function SHOW_RECOGNITION_TASK() {
    $('#tracing').hide();
    $('#tracingNextBut').hide();
    RESET_CANVAS()
    $('#recognition').show();
}

function RESET_CANVAS() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
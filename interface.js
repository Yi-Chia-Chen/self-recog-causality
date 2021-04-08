const TRACING_CANVAS_WIDTH = 600;
const TRACING_CANVAS_HEIGHT = 600;
const DISK_SIZE = 40;
const START_BUT_SIZE = 10;

function SETUP_TRACING_INTERFACE() {
    $("#tracing").css({"height": TRACING_CANVAS_HEIGHT + "px",
                    "width": TRACING_CANVAS_WIDTH + "px",});
    $("#disk").css({"display": "block",
                    "width": DISK_SIZE + "px",
                    "height": DISK_SIZE + "px",
                     "left": "500px",
                     "top": (350 - DISK_SIZE / 2) + "px"});
    $("#start").css({"display": "block",
                    "width": START_BUT_SIZE + "px",
                    "height": START_BUT_SIZE + "px",
                    "left": (100 - START_BUT_SIZE / 2) + "px",
                    "top": (350 - START_BUT_SIZE / 2) + "px"});
}

function SETUP_TRACING_CANVAS() {
    //var ctx = $('#canvas').getContext('2d');
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');
    ctx.canvas.width = TRACING_CANVAS_WIDTH;
    ctx.canvas.height = TRACING_CANVAS_HEIGHT;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'red';
}

function START_BUT_DISAPPEAR() {
    $('#start').hide();
}

function MOVE_DISK(){
    $('#disk').css({'transform': 'translateX(100px)',
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
    $('#disk').css('transform', 'translateX(0px)');
    $('#recognition').show();
}

function RESET_CANVAS() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
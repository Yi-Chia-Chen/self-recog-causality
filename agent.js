class trajectoryObject {
    constructor(triggerType) {
        this.triggerType = triggerType;
        this.allowDraw = true;
        self = this;
    }

    start(e){
        self.startTime = Date.now();
        START_BUT_DISAPPEAR();
        HIDE_CURSOR();
        self.pos = {x: e.offsetX - $('#canvas').offset().left, y: e.offsetY - $('#canvas').offset().top};
        self.startDraw();
    };

    recordRecognition() {
        SHOW_RECOGNITION_NEXT_BUT();
        var instrChoice = $('input[name="recognition"]:checked').val();
        if(instrChoice != undefined)
            self.recognition = instrChoice;
    }

    triggerDiskMove(type) {
        if(type == 'physical') {
            if (self.pos.x >= ($('#disk').position().left - PHYSICAL_TRIGGER_DIST)) {
                $(document).off('mousemove');
                self.allowDraw = false;
                SHOW_CURSOR();
                MOVE_DISK();
                setTimeout(SHOW_TRACING_NEXT_BUT, 1000);
                $('#recognition').change(self.recordRecognition);
            }
        } else if (type == 'social') {
            if (self.pos.x >= ($('#disk').position().left - SOCIAL_TRIGGER_DIST)) {
                $(document).off('mousemove');
                self.allowDraw = false;
                SHOW_CURSOR();
                MOVE_DISK();
                setTimeout(SHOW_TRACING_NEXT_BUT, 1000);
                $('#recognition').change(self.recordRecognition);
            }
        } else {
            if (self.pos.x >= ($('#disk').position().left - NO_TRIGGER_DIST)) {
                $(document).off('mousemove');
                self.allowDraw = false;
                SHOW_CURSOR();
                SHOW_TRACING_NEXT_BUT();
                $('#recognition').change(self.recordRecognition);
            }
        }
    }
}
/*
    ####### ####### #     # ####### ######
    #     #    #    #     # #       #     #
    #     #    #    #     # #       #     #
    #     #    #    ####### #####   ######
    #     #    #    #     # #       #   #
    #     #    #    #     # #       #    #
    #######    #    #     # ####### #     #

 */
class otherTrajectoryObject extends trajectoryObject{
    constructor(triggerType) {
        super(triggerType);
        this.index = 0;
        this.time_elapsed = Object.keys(OTHER_TRAJECTORY)[0];
        this.started = false;
        this.startMouseMoveSec = 0;
    }

    startDraw() {
        $(document).mousemove(REQUEST_TIMEOUT(self.draw, self.time_elapsed));
    }

    allowDraw() {
        self.startMouseMoveSec += 1;
        REQUEST_TIMEOUT(self.draw, self.time_elapsed);
        console.log(self.startMouseMoveSec);
    }

    draw() {
        if(self.allowDraw) {
            ctx.beginPath();

            ctx.moveTo(self.pos.x, self.pos.y);
            self.updatePos();
            ctx.lineTo(self.pos.x, self.pos.y);
            ctx.stroke();

            self.triggerDiskMove(self.triggerType);
            self.time_elapsed = Object.keys(OTHER_TRAJECTORY)[self.index] - Object.keys(OTHER_TRAJECTORY)[self.index-1];
            REQUEST_TIMEOUT(self.draw, self.time_elapsed);

        }
    }

    updatePos() {
        self.pos = Object.values(OTHER_TRAJECTORY)[self.index];
        self.index += 1;
    }

}

/*
  #####  ####### #       #######
 #     # #       #       #
 #       #       #       #
  #####  #####   #       #####
       # #       #       #
 #     # #       #       #
  #####  ####### ####### #

*/

class selfTrajectoryObject extends trajectoryObject{
    constructor(triggerType) {
        super(triggerType);
        this.selfTrajectory = {};
    }

    startDraw() {
        $(document).mousemove(self.draw);
    }

    draw(e) {
        ctx.beginPath();

        ctx.moveTo(self.pos.x, self.pos.y);
        var currentTime = Date.now();
        var timeStamp = (currentTime - self.startTime)/1000;
        self.record(timeStamp, {x: self.pos.x, y: self.pos.y});
        self.updatePos(e);
        ctx.lineTo(self.pos.x, self.pos.y);

        ctx.stroke();
        self.triggerDiskMove(self.triggerType);
    }

    updatePos(e) {
        self.pos.x = e.offsetX;
        self.pos.y = e.offsetY;
    }

    record(timeStamp, pos) {
        this.selfTrajectory[timeStamp] = pos;
        console.log(this.selfTrajectory);
    }

}


/*
 ####### #     # #     #  #####
 #       #     # ##    # #     #
 #       #     # # #   # #
 #####   #     # #  #  # #
 #       #     # #   # # #
 #       #     # #    ## #     #
 #        #####  #     #  #####

*/

function REQUEST_TIMEOUT(to_do, delay) {
    const START_TIME = Date.now();
    function loop() {
        const TIME_ELAPSED = (Date.now() - START_TIME) / 1000;
        if (TIME_ELAPSED >= delay) {
            to_do();
        } else {
            request_id = requestAnimationFrame(loop);
            REGISTER_CANCEL_FUNCTION(function() {cancelAnimationFrame(request_id)});
        }
    }
    var request_id = requestAnimationFrame(loop);
    REGISTER_CANCEL_FUNCTION(function() {cancelAnimationFrame(request_id)});
}

function REQUEST_CANCEL() {
    // register automatically
}

function REGISTER_CANCEL_FUNCTION (func) {
    REQUEST_CANCEL = func;
}

function VECTOR_LENGTH(x_diff, y_diff) {
    return Math.sqrt(Math.pow(x_diff, 2) + Math.pow(y_diff, 2));
}
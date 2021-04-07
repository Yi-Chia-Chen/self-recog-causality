class trajectoryObject {
    constructor(triggerType) {
        this.triggerType = triggerType;
        self = this;
    }

    start(e){
        self.startTime = Date.now();
        START_BUT_DISAPPEAR();
        HIDE_CURSOR();
        self.pos = {x: e.clientX, y: e.clientY};
        self.startDraw();
    }

    recordRecognition() {//xxx: should we save their first choices or last choices
        SHOW_RECOGNITION_NEXT_BUT();
        var instrChoice = $('input[name="recognition"]:checked').val();
        if(instrChoice != undefined)
            self.recognition = instrChoice;
    }

    triggerDiskMove(type) {
        if(type == 'physical') {
            if (self.pos.x >= ($('#disk').offset().left - PHYSICAL_TRIGGER_DIST)) {
                cancelAnimationFrame(globalID);
                $(document).off('mousemove');
                SHOW_CURSOR();
                MOVE_DISK();
                setTimeout(SHOW_TRACING_NEXT_BUT, 1000);
                $('#recognition').change(self.recordRecognition);
            }
        } else if (type == 'social') {
            if (self.pos.x >= ($('#disk').offset().left - SOCIAL_TRIGGER_DIST)) {
                cancelAnimationFrame(globalID);
                $(document).off('mousemove');
                SHOW_CURSOR();
                MOVE_DISK();
                setTimeout(SHOW_TRACING_NEXT_BUT, 1000);
                $('#recognition').change(self.recordRecognition);
            }
        } else {
            if (self.pos.x >= ($('#disk').offset().left - PHYSICAL_TRIGGER_DIST)) {
                cancelAnimationFrame(globalID);
                $(document).off('mousemove');
                SHOW_CURSOR();
                SHOW_TRACING_NEXT_BUT();
                $('#recognition').change(self.recordRecognition);
            }
        }
    }
}

class otherTrajectoryObject extends trajectoryObject{
    constructor(triggerType) {
        super(triggerType);
        this.index = 0;
        this.time_elapsed = Object.keys(OTHER_TRAJECTORY)[this.index + 1] - Object.keys(OTHER_TRAJECTORY)[this.index];
        this.destination = Object.values(OTHER_TRAJECTORY)[0];
        this.now_portion = 1;
    }


    startDraw() {
        $(document).mousemove(function(){globalID = requestAnimationFrame(self.draw)});
    }

    draw() {
        ctx.beginPath();

        ctx.moveTo(self.pos.x, self.pos.y);
        self.updatePos();
        ctx.lineTo(self.pos.x, self.pos.y);
        ctx.stroke();

        self.triggerDiskMove(self.triggerType);
        globalID = requestAnimationFrame(self.draw);
    }

    updatePos() {
        var x_vector = self.destination.x - self.pos.x;
        var y_vector = self.destination.y - self.pos.y;
        var now_dist = VECTOR_LENGTH(x_vector, y_vector);
        if (now_dist > Math.sqrt(1,1)){
            self.pos.x += x_vector * self.now_portion;
            self.pos.y += y_vector * self.now_portion;
        } else {
            self.time_elapsed = Object.keys(OTHER_TRAJECTORY)[self.index + 1] - Object.keys(OTHER_TRAJECTORY)[self.index];
            x_vector = Object.values(OTHER_TRAJECTORY)[self.index + 1].x - Object.values(OTHER_TRAJECTORY)[self.index].x;
            y_vector = Object.values(OTHER_TRAJECTORY)[self.index + 1].y - Object.values(OTHER_TRAJECTORY)[self.index].y;
            var now_destination_dist = VECTOR_LENGTH(x_vector, y_vector);
            var now_step_size = OTHER_TRAJECTORY_SPEED * self.time_elapsed;
            self.now_portion = Math.min(now_step_size / now_destination_dist, 1);
            self.index += 1;
            self.destination = Object.values(OTHER_TRAJECTORY)[self.index];
        }
    }
}


class selfTrajectoryObject extends trajectoryObject{
    constructor(triggerType) {
        super(triggerType);
    }
    selfTrajectory = [];

    startDraw() {
        $(document).mousemove(self.draw);
    }

    draw(e) {
        ctx.beginPath();

        ctx.moveTo(self.pos.x, self.pos.y);
        var currentTime = Date.now();
        var timeStamp = (currentTime - self.startTime)/1000;
        self.record(timeStamp, self.pos)
        self.updatePos(e);
        ctx.lineTo(self.pos.x, self.pos.y);

        ctx.stroke();
        self.triggerDiskMove(self.triggerType);
    }

    updatePos(e) {
        self.pos.x = e.clientX;
        self.pos.y = e.clientY;
    }

    record(timeStamp, pos) {//xxx: why does it only save the last coordinates in this.selfTrajectory?
        console.log(pos);
        this.selfTrajectory[timeStamp] = pos;
        console.log(this.selfTrajectory);
    }

}

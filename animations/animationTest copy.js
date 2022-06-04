

    let cnv, ctx, cx, cy, count, entities;
    const colors = ['#CE4721', '#B30A00', '#85002E', '#9C088C', '#AD55C9'];
    let nodes, particles;
    let spawnDelay = 20;
    let decayPct = 60;
    let sizeDecay = 0.15;
    let numNodes = 1;
    let WIDTH = window.innerWidth;
    let HEIGHT = window.innerHeight;
    
    //let mouseX = event.clientX;
    //let mouseY = event.clientY;

    // ON LOAD // 
    window.onload = function() {
        cnv = document.getElementById("canvas");
        cnv.width = WIDTH * 0.9;
        cnv.height = HEIGHT * 0.8;
        ctx = cnv.getContext('2d');
        cx = cnv.width / 2;
        cy = cnv.height / 2;
        count = 0;
        particles = [];
        nodes = [];
        var spawnX;
        var spawnY;
        for (i = 0; i < numNodes; i++){
            spawnX = cnv.width / 2;
            spawnY = cnv.height * .7;
            nodes.push(new Node(spawnX, spawnY, i));
        }
        
        loop();
    }

    // FUNCTIONS //

    // CLASSES //

    function Node(x, y, id) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.size = 20;
        this.dir = Math.PI / 4;
        //this.r = 0;
        //this.g = 250;
        //this.b = 50;
        //this.color = 'rgb('+ this.r + ','+ this.g +','+ this.b +')';
        this.alpha = 1.;
        this.color = 'rgba(255, 255, 255,' + this.alpha + ')';
        //this.delayId = id;
        this.freq = 15 * Math.PI;
        this.wobble = 10;
        //if (id > numNodes) {this.delayId = id - numNodes;}
        this.update = function() {
            // update fields
            //if (this.size * 5 <= 255) {this.r = this.size * 5; this.g = 255 - this.r; console.log(this.g)}
            //this.color = 'rgb('+ this.r + ','+ this.g +','+ this.b +')';
            let oldX = this.x;
            let oldY = this.y;
            this.x += this.wobble * Math.cos(count / this.freq);
            this.y += this.wobble * Math.sin(count / this.freq);
            this.wobble = 20 * Math.cos(count * Math.PI / this.freq);
            this.size = this.wobble ** 2 / 10;
            // send out particles
            //if (count % spawnDelay == 0){
            //this.size -= sizeDecay;
            
            particles.push(new NodeParticleSml(this.x, this.y, Math.PI - Math.atan2(oldX - this.x, oldY - this.y) + Math.PI, this.size));
            particles.push(new NodeParticle(this.x, this.y, Math.PI  - Math.atan2(oldX - this.x, oldY - this.y), this.size/2));
            
            
        }
        this.render = function() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
        }
    }

    function NodeParticle(x, y, dir, size) {
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.size = size;
        this.r = 255;
        this.g = 255;
        this.b = 0;
        this.a = 0.5;
        this.color = 'rgba('+ this.r + ',' + this.g + ',' + this.b + ',' +this.a+')';
        this.speed = 2 + 5 * Math.random();
        this.collision = false;
        this.rsign = 5;
        let newX;
        let newY;
        let node;
        let n;
        let distance;
        let collisionId
        this.update = function() {
            // update position
            newX = this.x + this.speed * Math.cos(this.dir);
            newY = this.y + this.speed * Math.sin(this.dir);
            // check collision
            /*for (n in nodes){
                if (n != this.id){
                    node = nodes[n];
                    distance = Math.sqrt( (node.x-newX)**2 + (node.y-newY)**2 );
                    
                    if (distance < 5) {
                        this.collision = true;
                        node.size += 10/node.size;
                        break
                        // continue
                    }
                }
            } */
            
            this.x = newX;
            this.y = newY;
            this.size -= this.size/decayPct;
            this.g -= this.rsign;
            if (this.g > 255 || this.g < 0) {
                this.rsign *= -1;
                this.g += 2 * this.rsign
            }
            
            this.color = 'rgba('+ this.r + ','+ this.g +','+ this.b + ',' + this.a + ')';
        }
        // render
        this.render = function() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
        }


    }

    function NodeParticleSml(x, y, dir, size) {
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.size = size;
        this.r = 200;
        this.g = 250;
        this.b = 20;
        this.a = 0.5;
        this.color = 'rgba('+ this.r + ',' + this.g + ',' + this.b + ',' +this.a+')';
        this.speed = 0.4 +  Math.random();
        this.collision = false;
        this.rsign = 3.5;
        this.asign = 1;
        let newX;
        let newY;
        let node;
        let n;
        let distance;
        let collisionId
        this.update = function() {
            // update position
            newX = this.x + this.speed * Math.cos(this.dir);
            newY = this.y + this.speed * Math.sin(this.dir);
            // check collision
            /*for (n in nodes){
                if (n != this.id){
                    node = nodes[n];
                    distance = Math.sqrt( (node.x-newX)**2 + (node.y-newY)**2 );
                    
                    if (distance < 5) {
                        this.collision = true;
                        node.size += 10/node.size;
                        break
                        // continue
                    }
                }
            } */
            
            this.x = newX;
            this.y = newY;
            this.size -= this.size/5/decayPct;

            if (this.a < 0.01 || this.a > 0.99) {
                this.asign = this.asign * -1;
            }

            this.a -= 0.02 * this.asign * this.a / 2;

            this.r += this.rsign;
            if (this.r > 255 || this.r < 0) {
                this.rsign *= -1;
                this.r += 2*this.rsign
            }
            this.color = 'rgba('+ this.r + ','+ this.g +','+ this.b + ',' + this.a +')';
        }
        // render
        this.render = function() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
        }


    }

       
    let new_parts;
    // MAIN LOOP // 
    function loop() {
        // time and frame
        count += 1;
        HEIGHT = window.innerHeight * 0.8;
        WIDTH = window.innerWidth * 0.9;
        cnv.height = HEIGHT;
        cnv.width = WIDTH;
        
        ctx = cnv.getContext('2d');
        // background
        ctx.fillStyle = 'rgba(0, 0, 0, .01)';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        // mouse //
        //mouseX = event.clientX;
        //mouseY = event.clientY;

        // update and render //
        new_parts = [];
        for (let part of particles) {
            if (part.x >= 0 & part.x <= cnv.width & part.y >= 0 & part.y <= cnv.height & part.collision == false & part.size > 1 ) {
                new_parts.push(part);
                part.update();
                part.render();
            } 
        } 
        paticles = new_parts;
        
        for (let node of nodes) {
            node.update();
            node.render();
            
        }   //entities = new_ents;
        

        requestAnimationFrame(loop);
    }
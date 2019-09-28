import {tiny, defs} from './resources.js';
                                                                // Pull these names into this module's scope for convenience:
const { Vec, Mat, Mat4, Color, Shape, Shader,
         Scene, Canvas_Widget, Code_Widget, Text_Widget } = tiny;
const { Cube, Subdivision_Sphere, Transforms_Sandbox_Base } = defs;

    // Now we have loaded everything in the files tiny-graphics.js, tiny-graphics-widgets.js, and assignment-3-resources.js.
    // This yielded "tiny", an object wrapping the stuff in the first two files, and "defs" for wrapping all the rest.

// (Can define Main_Scene's class here)
let flock;

const Main_Scene = defs.Transforms_Sandbox =
class Transforms_Sandbox extends Transforms_Sandbox_Base
{                                                    // **Transforms_Sandbox** is a Scene object that can be added to any display canvas.
                                                     // This particular scene is broken up into two pieces for easier understanding.
                                                     // See the other piece, Transforms_Sandbox_Base, if you need to see the setup code.
                                                     // The piece here exposes only the display() method, which actually places and draws 
                                                     // the shapes.  We isolate that code so it can be experimented with on its own.
                                                     // This gives you a very small code sandbox for editing a simple scene, and for
                                                     // experimenting with matrix transformations.
  constructor() 
  {
    super();    

    this.boids = []        
    this.flock = new Flock();

    for (let i = 0; i < 120; i++) 
    {
      let b = new Boid(Math.random() * 2 -1,Math.random() * 2 -1,-Math.random() * 2 - 1);      
      this.flock.addBoid(b);
    }   
  }  


 draw_dragonfly(context, program_state, model_transform, speed)
 {
       const blue = Color.of( 0, 0, 1, 1 ), yellow = Color.of( 1, 1, 0, 1 ), orange = Color.of ( 1, 0.5, 0, 1 ), 
             violet = Color.of ( 0.3, 0.1, 0.4, 0.3 );

      // HEAD
      model_transform = model_transform.times( Mat4.translation([ 0,0,0 ]) ); 
      this.shapes.box.draw ( context, program_state, model_transform, this.materials.plastic.override( yellow ) );

      model_transform = model_transform.times( Mat4.translation([ 3,0,0 ]) )
                                       .times( Mat4.scale([ 2,2,2 ]) );       
      this.shapes.ball.draw ( context, program_state, model_transform, this.materials.metal.override( blue ) );

      model_transform = model_transform.times( Mat4.translation([ -3,0,0 ]) );       
      this.shapes.ball.draw ( context, program_state, model_transform, this.materials.metal.override( blue ) );

      // BODY 
      // Inverse       
      model_transform = model_transform.times( Mat4.scale([ 0.5, 0.5, 0.5 ]) )
                                       .times( Mat4.translation([ 3, 0, 0 ]));      
      
      for (let i = 0; i < 10; ++i)
      {
          if (i == 0)
            model_transform = model_transform.times( Mat4.translation([ 0, 0, -2 ]) )
          else     
          {
                model_transform = model_transform.times( Mat4.translation([ 0, -1, -1 ]) )
                                                 .times( Mat4.rotation(0.1 + 0.1 * Math.sin(speed), Vec.of( -1, 0, 0 ) ) )
                                                 .times( Mat4.translation([ 0, 1, -1 ]) );            
            if (i == 1)
            {
                  let wing1 = model_transform.copy();
                  let wing2 = model_transform.copy();
                  let leg1 = model_transform.copy();
                  let leg2 = model_transform.copy();
                  wing1 = wing1.times( Mat4.translation([ -1, 1, 0 ]) )
                               .times( Mat4.rotation(0.5 * Math.sin(speed), Vec.of( 0, 0, 1 ) ) )
                               .times( Mat4.scale([ 8, 0.2, 0.8 ]))
                               .times( Mat4.translation([ -1, 1, 0 ]) );

                  wing2 = wing2.times( Mat4.translation([ 1, 1, 0 ]) )
                               .times( Mat4.rotation(-0.5 * Math.sin(speed), Vec.of( 0, 0, 1 ) ) )
                               .times( Mat4.scale([ 8, 0.2, 0.8 ]))
                               .times( Mat4.translation([ 1, 1, 0 ]) );

                  this.shapes.box.draw( context, program_state, wing1, this.materials.metal.override( violet ) );
                  this.shapes.box.draw( context, program_state, wing2, this.materials.metal.override( violet ) );

                  leg1 = leg1.times( Mat4.translation([ -1, -1, 0 ]) )
                             .times( Mat4.rotation(-0.1 - 0.1 * Math.sin(speed), Vec.of( 0, 0, 1 ) ) )                                            
                             .times( Mat4.translation([ -0.3, -2, 0 ]) );
                  this.shapes.box.draw( context, program_state, leg1.times( Mat4.scale([ 0.3, 2, 0.3  ])), this.materials.metal.override( yellow ) );
      
                  let second_leg1 = leg1.copy();                    
                  second_leg1 = second_leg1.times( Mat4.translation([ 0.5, -2, 0 ]) )
                                           .times( Mat4.rotation(0.1 + 0.1 * Math.sin(speed), Vec.of( 0, 0, 1 ) ) )                                              
                                           .times( Mat4.translation([ -0.5, -1.96, 0 ]) )                                             
                                           .times( Mat4.scale([ 0.3, 2, 0.3 ]));
                  this.shapes.box.draw( context, program_state, second_leg1, this.materials.metal.override( yellow ) );

                  leg2 = leg2.times( Mat4.translation([ 1, -1, 0]) )
                             .times( Mat4.rotation(0.1 + 0.1 * Math.sin(speed), Vec.of( 0, 0, 1 ) ) )                             
                             .times( Mat4.translation([ 0.3, -2, 0 ]) );
                  this.shapes.box.draw( context, program_state, leg2.times( Mat4.scale([ 0.3, 2, 0.3 ])), this.materials.metal.override( yellow ) );

                  let second_leg2 = leg2.copy();                    
                  second_leg2 = second_leg2.times( Mat4.translation([ -0.5, -2, 0 ]) )
                                           .times( Mat4.rotation(-0.1 - 0.1 * Math.sin(speed), Vec.of( 0, 0, 1 ) ) )                                              
                                           .times( Mat4.translation([ 0.5, -1.96, 0 ]) )                                             
                                           .times( Mat4.scale([ 0.3, 2, 0.3 ]));
                  this.shapes.box.draw( context, program_state, second_leg2, this.materials.metal.override( yellow ) );
            }
            if (i == 2)
            {
                  let wing1 = model_transform.copy();
                  let wing2 = model_transform.copy();
                  let leg1 = model_transform.copy();
                  let leg2 = model_transform.copy();
                  wing1 = wing1.times( Mat4.translation([ -1, 1, 0 ]) )
                               .times( Mat4.rotation(0.5 * Math.sin(speed), Vec.of( 0, 0, 1 ) ) )
                               .times( Mat4.scale([ 8, 0.2, 0.8 ]))
                               .times( Mat4.translation([ -1, 1, 0]) );

                  wing2 = wing2.times( Mat4.translation([ 1, 1, 0]) )
                               .times( Mat4.rotation(-0.5 * Math.sin(speed), Vec.of( 0, 0, 1 ) ) )
                               .times( Mat4.scale([ 8, 0.2, 0.8 ]))
                               .times( Mat4.translation([ 1, 1, 0 ]) );

                  this.shapes.box.draw( context, program_state, wing1, this.materials.metal.override( violet ) );
                  this.shapes.box.draw( context, program_state, wing2, this.materials.metal.override( violet ) );


                  leg1 = leg1.times( Mat4.translation([ -1, -1, 0 ]) )
                             .times( Mat4.rotation(-0.1 - 0.1 * Math.sin(speed), Vec.of( 0, 0, 1 ) ) )                                           
                             .times( Mat4.translation([ -0.3,-2, 0 ]) );
                  this.shapes.box.draw( context, program_state, leg1.times( Mat4.scale([ 0.3, 2, 0.3 ])), this.materials.metal.override( yellow ) );

                  let second_leg1 = leg1.copy();                    
                  second_leg1 = second_leg1.times( Mat4.translation([ 0.5,-2, 0 ]) )
                                           .times( Mat4.rotation(0.1 + 0.1 * Math.sin(speed), Vec.of( 0, 0, 1 ) ) )                                              
                                           .times( Mat4.translation([ -0.5, -1.96, 0 ]) )                                             
                                           .times( Mat4.scale([ 0.3, 2, 0.3 ]));
                  this.shapes.box.draw( context, program_state, second_leg1, this.materials.metal.override( yellow ) );
      

                  leg2 = leg2.times( Mat4.translation([ 1, -1, 0 ]) )
                             .times( Mat4.rotation(0.1 + 0.1 * Math.sin(speed), Vec.of( 0, 0, 1 ) ) )
                             .times( Mat4.translation([ 0.3, -2, 0 ]) );

                   this.shapes.box.draw( context, program_state, leg2.times( Mat4.scale([ 0.3, 2, 0.3 ])), this.materials.metal.override( yellow ) );

                  let second_leg2 = leg2.copy();                    
                  second_leg2 = second_leg2.times( Mat4.translation([ -0.5,- 2, 0]) )
                                           .times( Mat4.rotation(-0.1 - 0.1 * Math.sin(speed), Vec.of( 0, 0, 1 ) ) )                                              
                                           .times( Mat4.translation([ 0.5, -1.96, 0]) )                                             
                                           .times( Mat4.scale([ 0.3, 2, 0.3 ]));
                  this.shapes.box.draw( context, program_state, second_leg2, this.materials.metal.override( yellow ) );
            } 

            if (i ==3)
            {
                  let leg1 = model_transform.copy();
                  let leg2 = model_transform.copy();
                  leg1 = leg1.times( Mat4.translation([ -1, -1, 0 ]) )
                             .times( Mat4.rotation(-0.1 - 0.1 * Math.sin(speed), Vec.of( 0, 0, 1 ) ) )                                           
                             .times( Mat4.translation([ -0.3, -2, 0 ]) );
                  this.shapes.box.draw( context, program_state, leg1.times( Mat4.scale([ 0.3, 2, 0.3 ])), this.materials.metal.override( yellow ) );

                  let second_leg1 = leg1.copy();                    
                  second_leg1 = second_leg1.times( Mat4.translation([ 0.5, -2, 0 ]) )
                                           .times( Mat4.rotation(0.1 + 0.1 * Math.sin(speed), Vec.of( 0, 0, 1 ) ) )                                              
                                           .times( Mat4.translation([ -0.5, -1.96, 0 ]) )                                             
                                           .times( Mat4.scale([ 0.3, 2, 0.3 ]));
                  this.shapes.box.draw( context, program_state, second_leg1, this.materials.metal.override( yellow ) );
                        

                  leg2 = leg2.times( Mat4.translation([ 1, -1, 0 ]) )
                             .times( Mat4.rotation(0.1 + 0.1 * Math.sin(speed), Vec.of( 0, 0, 1 ) ) )
                             .times( Mat4.translation([ 0.3, -2, 0 ]) );

                  this.shapes.box.draw( context, program_state, leg2.times( Mat4.scale([ 0.3, 2, 0.3 ])), this.materials.metal.override( yellow ) );

                  let second_leg2 = leg2.copy();                    
                  second_leg2 = second_leg2.times( Mat4.translation([ -0.5, -2, 0]) )
                                           .times( Mat4.rotation(-0.1 - 0.1 * Math.sin(speed), Vec.of( 0, 0, 1 ) ) )                                              
                                           .times( Mat4.translation([ 0.5, -1.96, 0]) )                                             
                                           .times( Mat4.scale([0.3, 2, 0.3 ]));
                  this.shapes.box.draw( context, program_state, second_leg2, this.materials.metal.override( yellow ) );
            }
          }                                                                                                       
          this.shapes.box.draw ( context, program_state, model_transform, this.materials.plastic.override( orange ) );          
      }   
 }

 
  display( context, program_state)
    {                                                // display():  Called once per frame of animation.  For each shape that you want to
                                                     // appear onscreen, place a .draw() call for it inside.  Each time, pass in a
                                                     // different matrix value to control where the shape appears.

                                                     // Variables that are in scope for you to use:
                                                     // this.shapes.box:   A vertex array object defining a 2x2x2 cube.
                                                     // this.shapes.ball:  A vertex array object defining a 2x2x2 spherical surface.
                                                     // this.materials.metal:    Selects a shader and draws with a shiny surface.
                                                     // this.materials.plastic:  Selects a shader and draws a more matte surface.
                                                     // this.lights:  A pre-made collection of Light objects.
                                                     // this.hover:  A boolean variable that changes when the user presses a button.
                                                     // program_state:  Information the shader needs for drawing.  Pass to draw().
                                                     // context:  Wraps the WebGL rendering context shown onscreen.  Pass to draw().                                                       

                                                // Call the setup code that we left inside the base class:
      super.display( context, program_state );
        

      /**********************************
      Start coding down here!!!!
      **********************************/         
    
      const t = this.t = program_state.animation_time/1000; 
      const speed = 7 * t;
      let model_transform = Mat4.identity().times( Mat4.scale([ 0.25, 0.25, 0.25 ]));

      if( !this.hover )
        model_transform = model_transform.times( Mat4.rotation( t, Vec.of( 0, -1, 0 ) ) )                                          
                                         .times( Mat4.translation([ 12, 0, 12 ]))
                                         .times( Mat4.rotation( 0.5 * Math.sin(speed), Vec.of( 1, 0, 0 ) ) );

      if ( this.swarm )
      {          
        this.flock.run(this, context, program_state, model_transform, speed);
      }
      else
      {
        this.draw_dragonfly(context, program_state, model_transform, speed);
      }
    }    
}
const Additional_Scenes = [];
export { Main_Scene, Additional_Scenes, Canvas_Widget, Code_Widget, Text_Widget, defs }


//                                                   // From here on down it's just some example shapes drawn for you -- freely 
//                                                   // replace them with your own!  Notice the usage of the Mat4 functions 
//                                                   // translation(), scale(), and rotation() to generate matrices, and the 
//                                                   // function times(), which generates products of matrices.

//       const blue = Color.of( 0,0,1,1 ), yellow = Color.of( 1,1,0,1 );

//                                     // Variable model_transform will be a local matrix value that helps us position shapes.
//                                     // It starts over as the identity every single frame - coordinate axes at the origin.
//       let model_transform = Mat4.identity();
//                                                      // Draw a hierarchy of objects that appear connected together.  The first shape
//                                                      // will be the "parent" or "root" of the hierarchy.  The matrices of the 
//                                                      // "child" shapes will use transformations that are calculated as relative
//                                                      // values, based on the parent shape's matrix.  Moving the root node should
//                                                      // therefore move the whole hierarchy.  To perform this, we'll need a temporary
//                                                      // matrix variable that we incrementally adjust (by multiplying in new matrix
//                                                      // terms, in between drawing shapes).  We'll draw the parent shape first and
//                                                      // then incrementally adjust the matrix it used to draw child shapes.

//                                                      // Position the root shape.  For this example, we'll use a box 
//                                                      // shape, and place it at the coordinate origin 0,0,0:
//       model_transform = model_transform.times( Mat4.translation([ 0,0,0 ]) );
//                                                                                               // Draw the top box:
//       this.shapes.box.draw( context, program_state, model_transform, this.materials.plastic.override( yellow ) );
      
//                                                      // Tweak our coordinate system downward 2 units for the next shape.
//       model_transform = model_transform.times( Mat4.translation([ 0, -2, 0 ]) );
//                                                                            // Draw the ball, a child of the hierarchy root.
//                                                                            // The ball will have its own children as well.
//       this.shapes.ball.draw( context, program_state, model_transform, this.materials.metal.override( blue ) );
                                                                      
//                                                                       // Prepare to draw another box object 2 levels deep 
//                                                                       // within our hierarchy.
//                                                                       // Find how much time has passed in seconds; we can use
//                                                                       // time as an input when calculating new transforms:
//       const t = this.t = program_state.animation_time/1000;

//                                                       // Spin our current coordinate frame as a function of time.  Only do
//                                                       // this movement if the button on the page has not been toggled off.
//       if( !this.hover )
//         model_transform = model_transform.times( Mat4.rotation( t, Vec.of( 0,1,0 ) ) )

//                                                       // Perform three transforms in a row.
//                                                       // Rotate the coordinate frame counter-clockwise by 1 radian,
//                                                       // Scale it longer on its local Y axis,
//                                                       // and lastly translate down that scaled Y axis by 1.5 units.
//                                                       // That translation is enough for the box and ball volume to miss
//                                                       // one another (new box radius = 2, ball radius = 1, coordinate
//                                                       // frame axis is currently doubled in size).
//       model_transform   = model_transform.times( Mat4.rotation( 1, Vec.of( 0,0,1 ) ) )
//                                          .times( Mat4.scale      ([ 1,   2, 1 ]) )
//                                          .times( Mat4.translation([ 0,-1.5, 0 ]) );
//                                                                                     // Draw the bottom (child) box:
//       this.shapes.box.draw( context, program_state, model_transform, this.materials.plastic.override( yellow ) );

//                               // Note that our coordinate system stored in model_transform still has non-uniform scaling
//                               // due to our scale() call.  This could have undesired effects for subsequent transforms;
//                               // rotations will behave like shears.  To avoid this it may have been better to do the
//                               // scale() last and then immediately unscale after the draw.  Or better yet, don't store
//                               // the scaled matrix back in model_transform at all -- but instead in just a temporary
//                               // expression that we pass into draw(), or store under a different name.

 
// Flock object
// Does very little, simply manages the array of all the boids
function Flock() {
  // An array for all the boids
  this.boids = []; // Initialize the array
}

Flock.prototype.run = function(sandbox, context, program_state, model_transform, speed) {
  for (let i = 0; i < this.boids.length; i++) {
    this.boids[i].run(this.boids, sandbox, context, program_state, model_transform, speed); 
    // Passing the entire list of boids to each boid individually
  }
}

Flock.prototype.addBoid = function(b) {
  this.boids.push(b);
}

// Boid class
// Methods for Separation, Cohesion, Alignment added
function Boid(x,y,z) {
  this.acceleration = Vec.of( 0, 0, 0 );  
  this.velocity = Vec.of( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
  this.position = Vec.of( x, y, z );
  
  this.r = 3.0;
  this.maxspeed = 3.0 / 1000;    // Maximum speed
  this.maxforce = 0.5 / 1000; // Maximum steering force
}

Boid.prototype.run = function(boids, sandbox,context, program_state, model_transform, speed) {
  this.flock(boids);
  this.update(program_state);
  this.borders();
  this.render(sandbox,context, program_state, model_transform, speed);
}

Boid.prototype.applyForce = function(force) {
  // We could add mass here if we want A = F / M
  this.acceleration = this.acceleration.plus(force);
}

// We accumulate a new acceleration each time based on three rules
Boid.prototype.flock = function(boids) {
  let sep = this.separate(boids);   // Separation
  let ali = this.align(boids);      // Alignment
  let coh = this.cohesion(boids);   // Cohesion
  // Arbitrarily weight these forces
  sep = sep.times(1.5 / 1000);
  ali = ali.times(1 / 1000);
  coh = coh.times(1 / 1000);
  // Add the force vectors to acceleration
  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
}

// Method to update location
Boid.prototype.update = function(program_state) {
  // Update velocity
  this.velocity=this.velocity.plus(this.acceleration);
  
  // Limit speed
  if (this.velocity.norm() > this.maxspeed)
  {
    let k = this.velocity.norm() / this.maxspeed;
    this.velocity.scale(1/k);
  }
  //this.velocity.limit(this.maxspeed);
 // this.velocity = 
  this.position = this.position.plus(this.velocity.times(program_state.animation_delta_time));
  //console.log(this.position);
  // Reset accelertion to 0 each cycle
  this.acceleration = this.acceleration.times(0);
}

// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
Boid.prototype.seek = function(target) {
  let desired = target.minus(this.position);  // A vector pointing from the location to the target
  // Normalize desired and scale to maximum speed
  desired.normalize();
  desired = desired.times(this.maxspeed);
  // Steering = Desired minus Velocity
  let steer = desired.minus(this.velocity);
  //steer.limit(this.maxforce);  // Limit to maximum steering force
  if (steer.norm()  > this.maxforce)
  {
    let k = steer.norm()  / this.maxforce;
    steer.scale(1/k);
  }
  return steer;
}

Boid.prototype.render = function(sandbox, context, program_state, model_transform, speed) {
  
  
  model_transform = Mat4.identity(); 
  //model_transform = model_transform.times( Mat4.rotation(2, Vec.of( 1,0,0 ) ) )
  
   

   
   model_transform = Mat4.translation(this.position ).times(Mat4.inverse( 
                    Mat4.look_at( Vec.of( 0,0,0 ), this.velocity.times(-1), Vec.of( 0,1,0 ) ) ) );
 
  
  model_transform = model_transform.times( Mat4.scale([-0.05, 0.05, 0.05]));
                                    


  const blue = Color.of( 0,0,1,1 ), yellow = Color.of( 1,1,0,1 ), orange = Color.of ( 1,0.5,0,1 ), violet = Color.of ( 0.3,0.1,0.4,0.3 );
      // HEAD
      model_transform = model_transform.times( Mat4.translation([ 0,0,0 ]) ); 
      sandbox.shapes.box.draw ( context, program_state, model_transform, sandbox.materials.plastic.override( yellow ) );

      model_transform = model_transform.times( Mat4.translation([ 3,0,0 ]) )
                                       .times( Mat4.scale([ 2,2,2 ]) );       
      sandbox.shapes.ball.draw ( context, program_state, model_transform, sandbox.materials.metal.override( blue ) );

      model_transform = model_transform.times( Mat4.translation([ -3,0,0 ]) );       
      sandbox.shapes.ball.draw ( context, program_state, model_transform, sandbox.materials.metal.override( blue ) );

      // BODY 

      // Inverse       
      model_transform = model_transform.times( Mat4.scale([ 0.5, 0.5, 0.5 ]) )
                                          .times( Mat4.translation([ 3, 0, 0 ]));      
      
      for (let i = 0; i < 10; ++i)
      {
          if (i == 0)
            model_transform = model_transform.times( Mat4.translation([ 0,0,-2 ]) )
          else     
          {
                model_transform = model_transform.times( Mat4.translation([ 0,-1,-1 ]) )
                                                 .times( Mat4.rotation(0.1 + 0.1 * Math.sin(speed), Vec.of( -1,0,0 ) ) )
                                                 .times( Mat4.translation([ 0,1,-1 ]) );            if (i == 1)
            {
                  let wing1 = model_transform.copy();
                  let wing2 = model_transform.copy();
                  let leg1 = model_transform.copy();
                  let leg2 = model_transform.copy();
                  wing1 = wing1.times( Mat4.translation([ -1, 1, 0]) )
                               .times( Mat4.rotation(0.5 * Math.sin(speed), Vec.of( 0,0,1 ) ) )
                               .times( Mat4.scale([8, 0.2, 0.8 ]))
                               .times( Mat4.translation([ -1,1,0]) );

                  wing2 = wing2.times( Mat4.translation([ 1, 1, 0]) )
                               .times( Mat4.rotation(-0.5 * Math.sin(speed), Vec.of( 0,0,1 ) ) )
                               .times( Mat4.scale([8, 0.2, 0.8 ]))
                               .times( Mat4.translation([ 1,1,0]) );

                  sandbox.shapes.box.draw( context, program_state, wing1, sandbox.materials.metal.override( violet ) );
                  sandbox.shapes.box.draw( context, program_state, wing2, sandbox.materials.metal.override( violet ) );

                  leg1 = leg1.times( Mat4.translation([ -1, -1, 0]) )
                             .times( Mat4.rotation(-0.1 - 0.1 * Math.sin(speed), Vec.of( 0,0,1 ) ) )                                            
                             .times( Mat4.translation([ -0.3,-2,0]) );
                  sandbox.shapes.box.draw( context, program_state, leg1.times( Mat4.scale([0.3, 2, 0.3  ])), sandbox.materials.metal.override( yellow ) );
      
                  let second_leg1 = leg1.copy();                    
                  second_leg1 = second_leg1.times( Mat4.translation([ 0.5,-2, 0]) )
                                           .times( Mat4.rotation(0.1 + 0.1 * Math.sin(speed), Vec.of( 0,0,1 ) ) )                                              
                                           .times( Mat4.translation([ -0.5,-1.96,0]) )                                             
                                           .times( Mat4.scale([0.3, 2, 0.3  ]));
                  sandbox.shapes.box.draw( context, program_state, second_leg1, sandbox.materials.metal.override( yellow ) );

                  leg2 = leg2.times( Mat4.translation([ 1, -1, 0]) )
                             .times( Mat4.rotation(0.1 + 0.1 * Math.sin(speed), Vec.of( 0,0,1 ) ) )                             
                             .times( Mat4.translation([ 0.3,-2,0]) );
                  sandbox.shapes.box.draw( context, program_state, leg2.times( Mat4.scale([0.3, 2, 0.3  ])), sandbox.materials.metal.override( yellow ) );

                  let second_leg2 = leg2.copy();                    
                  second_leg2 = second_leg2.times( Mat4.translation([ -0.5,-2, 0]) )
                                          .times( Mat4.rotation(-0.1 - 0.1 * Math.sin(speed), Vec.of( 0,0,1 ) ) )                                              
                                           .times( Mat4.translation([ 0.5,-1.96,0]) )                                             
                                           .times( Mat4.scale([0.3, 2, 0.3  ]));
                  sandbox.shapes.box.draw( context, program_state, second_leg2, sandbox.materials.metal.override( yellow ) );
            }
            if (i == 2)
            {
                  let wing1 = model_transform.copy();
                  let wing2 = model_transform.copy();
                  let leg1 = model_transform.copy();
                  let leg2 = model_transform.copy();
                  wing1 = wing1.times( Mat4.translation([ -1, 1, 0]) )
                                            .times( Mat4.rotation(0.5 * Math.sin(speed), Vec.of( 0,0,1 ) ) )
                                            .times( Mat4.scale([8, 0.2, 0.8 ]))
                                            .times( Mat4.translation([ -1,1,0]) );

                  wing2 = wing2.times( Mat4.translation([ 1, 1, 0]) )
                                            .times( Mat4.rotation(-0.5 * Math.sin(speed), Vec.of( 0,0,1 ) ) )
                                            .times( Mat4.scale([8, 0.2, 0.8 ]))
                                            .times( Mat4.translation([ 1,1,0]) );

                  sandbox.shapes.box.draw( context, program_state, wing1, sandbox.materials.metal.override( violet ) );
                  sandbox.shapes.box.draw( context, program_state, wing2, sandbox.materials.metal.override( violet ) );


                  leg1 = leg1.times( Mat4.translation([ -1, -1, 0]) )
                                            .times( Mat4.rotation(-0.1 - 0.1 * Math.sin(speed), Vec.of( 0,0,1 ) ) )                                           
                                             .times( Mat4.translation([ -0.3,-2,0]) );
                  sandbox.shapes.box.draw( context, program_state, leg1.times( Mat4.scale([0.3, 2, 0.3  ])), sandbox.materials.metal.override( yellow ) );

                  let second_leg1 = leg1.copy();                    
                  second_leg1 = second_leg1.times( Mat4.translation([ 0.5,-2, 0]) )
                                           .times( Mat4.rotation(0.1 + 0.1 * Math.sin(speed), Vec.of( 0,0,1 ) ) )                                              
                                           .times( Mat4.translation([ -0.5,-1.96,0]) )                                             
                                           .times( Mat4.scale([0.3, 2, 0.3  ]));
                  sandbox.shapes.box.draw( context, program_state, second_leg1, sandbox.materials.metal.override( yellow ) );
      

                  leg2 = leg2.times( Mat4.translation([ 1, -1, 0]) )
                                            .times( Mat4.rotation(0.1 + 0.1 * Math.sin(speed), Vec.of( 0,0,1 ) ) )
                                            
                                             .times( Mat4.translation([ 0.3,-2,0]) );

                   sandbox.shapes.box.draw( context, program_state, leg2.times( Mat4.scale([0.3, 2, 0.3  ])), sandbox.materials.metal.override( yellow ) );

                   let second_leg2 = leg2.copy();                    
                  second_leg2 = second_leg2.times( Mat4.translation([ -0.5,-2, 0]) )
                                           .times( Mat4.rotation(-0.1 - 0.1 * Math.sin(speed), Vec.of( 0,0,1 ) ) )                                              
                                           .times( Mat4.translation([ 0.5,-1.96,0]) )                                             
                                           .times( Mat4.scale([0.3, 2, 0.3  ]));
                  sandbox.shapes.box.draw( context, program_state, second_leg2, sandbox.materials.metal.override( yellow ) );
            } 

            if (i ==3)
            {
                  let leg1 = model_transform.copy();
                  let leg2 = model_transform.copy();
                  leg1 = leg1.times( Mat4.translation([ -1, -1, 0]) )
                                            .times( Mat4.rotation(-0.1 - 0.1 * Math.sin(speed), Vec.of( 0,0,1 ) ) )                                           
                                             .times( Mat4.translation([ -0.3,-2,0]) );
                  sandbox.shapes.box.draw( context, program_state, leg1.times( Mat4.scale([0.3, 2, 0.3  ])), sandbox.materials.metal.override( yellow ) );

                  let second_leg1 = leg1.copy();                    
                  second_leg1 = second_leg1.times( Mat4.translation([ 0.5,-2, 0]) )
                                           .times( Mat4.rotation(0.1 + 0.1 * Math.sin(speed), Vec.of( 0,0,1 ) ) )                                              
                                           .times( Mat4.translation([ -0.5,-1.96,0]) )                                             
                                           .times( Mat4.scale([0.3, 2, 0.3  ]));
                  sandbox.shapes.box.draw( context, program_state, second_leg1,sandbox.materials.metal.override( yellow ) );
      

                  leg2 = leg2.times( Mat4.translation([ 1, -1, 0]) )
                                            .times( Mat4.rotation(0.1 + 0.1 * Math.sin(speed), Vec.of( 0,0,1 ) ) )
                                            
                                             .times( Mat4.translation([ 0.3,-2,0]) );

                   sandbox.shapes.box.draw( context, program_state, leg2.times( Mat4.scale([0.3, 2, 0.3  ])), sandbox.materials.metal.override( yellow ) );

                   let second_leg2 = leg2.copy();                    
                  second_leg2 = second_leg2.times( Mat4.translation([ -0.5,-2, 0]) )
                                           .times( Mat4.rotation(-0.1 - 0.1 * Math.sin(speed), Vec.of( 0,0,1 ) ) )                                              
                                           .times( Mat4.translation([ 0.5,-1.96,0]) )                                             
                                           .times( Mat4.scale([0.3, 2, 0.3  ]));
                  sandbox.shapes.box.draw( context, program_state, second_leg2, sandbox.materials.metal.override( yellow ) );
            }
          }                                                                                                       
          sandbox.shapes.box.draw ( context, program_state, model_transform, sandbox.materials.plastic.override( orange ) ); 
                  
      }      
}


Boid.prototype.borders = function() {
 const xBound = 140.0/10;
      const yBound = 110.0/10;
      const zBound = 140.0/10;

      if (this.position[0] > xBound) this.position[0] = -xBound;
      if (this.position[0] < -xBound) this.position[0] = xBound;

      if (this.position[1] > yBound) this.position[1] = -yBound;
      if (this.position[1] < -yBound) this.position[1] = yBound;
      
      if (this.position[2] > zBound) this.position[2] = -zBound;
      if (this.position[2] < -zBound) this.position[2] = zBound;
 }

// Separation
// Method checks for nearby boids and steers away


Boid.prototype.separate = function(boids) {
  let desiredseparation = 25.0;
  let steer = Vec.of(0,0,0);
  let count = 0;
  // For every boid in the system, check if it's too close
  for (let i = 0; i < boids.length; i++) {
       let a = this.position.minus(boids[i].position);
   let d = a.norm();
   //let d = 10;
    //let d = p5.Vector.dist(this.position,boids[i].position);
    // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
    if ((d > 0) && (d < desiredseparation)) {
      // Calculate vector pointing away from neighbor
      let diff = this.position.minus( boids[i].position);
      diff.normalize();
      diff = diff.times(1/d);        // Weight by distance
      steer = steer.plus(diff);
      count++;            // Keep track of how many
    }
  }
  // Average -- divide by how many
  if (count > 0) {
    steer.scale(1/count);
  }

  // As long as the vector is greater than 0
  if (steer.norm() * steer.norm() > 0) {
    // Implement Reynolds: Steering = Desired - Velocity
    steer.normalize();
    steer = steer.times(this.maxspeed);
    steer = steer.minus(this.velocity);
    //steer.limit(this.maxforce);
    if (steer.norm() * steer.norm() > this.maxforce)
    {
    let k = (steer.norm() * steer.norm()) / this.maxforce;
    steer = steer.times(1/k);
    }
  }
  return steer;
}

// Alignment
// For every nearby boid in the system, calculate the average velocity
Boid.prototype.align = function(boids) {
  let neighbordist = 50;
  let sum = Vec.of(0,0,0);
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let a = this.position.minus(boids[i].position);
    let d = a.norm();
//let d = 10;
    //let d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum = sum.plus(boids[i].velocity);
      count++;
    }
  }
  if (count > 0) {
    sum.scale(1/count);
    sum.normalize();
    sum.scale(this.maxspeed);
    let steer = sum.minus( this.velocity);
    //steer.limit(this.maxforce);
    if (steer.norm()  > this.maxforce)
    {
    let k = steer.norm() / this.maxforce;
    steer = steer.times(1/k);
    }
    return steer;
  } else {
    return Vec.of(0,0,0);
  }
}

// Cohesion
// For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
Boid.prototype.cohesion = function(boids) {
  let neighbordist = 50;
  let sum = Vec.of(0,0, 0);   // Start with empty vector to accumulate all locations
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let a = this.position.minus(boids[i].position);
    let d = a.norm();
//let d = 10;
    //let d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum = sum.plus(boids[i].position); // Add location
      count++;
    }
  }
  if (count > 0) {
    sum = sum.times(1/count);
    return this.seek(sum);  // Steer towards the location
  } else {
    return Vec.of(0,0, 0);
  }
}



const mongoose = require('mongoose');
const slugify = require('slugify')

const tourSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim:true,
    maxlength:[40,'A Tour must have less or equal then 40 character'],
    minlength:[10,'A Tour must have below or equal then 10 character']

  },
  slug:String,
  ratingsAverage: {
    type: Number,
    default: 4.6,
    min:[1,'Rating must be aboove 1.0'],
    max:[5,'Rating must me below 5.0'],
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have Durations'],
  },

  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: {
    ///this validtor work only with create doucment not when update document 
    type:Number,
    validate:{
      validator:function(val){
        //this only poin current document on new doc creation
     return this.price>val 
    },
    message:'Discount price ({VALUE}) should be below than regular price '
  }
  } ,
  maxGroupSize: {
    type: Number,
    required: [true, 'Atour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have difficulty'],
    enum:{
      values:['easy','medium','difficult'],
      message:'Difficulty must be either: easy medium difficult'
    }
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have discription'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have cover Image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
  secretTour:{
    type:Boolean,
    default:false,
  },
},{
  toJSON:{virtuals:true},
  toObject:{virtuals:true}

});
//Document middleWare 

////virtual property is use when we not to save data in database but also want send back additional data to client then we use vertual property 
  tourSchema.virtual('durationWeeeks').get(function(){
    console.log('hello im in vertual')
    return `${this.duration/7} Week`
  })
  //Document Middleware run before .save or . create
  tourSchema.pre("save",function(next){
    this.slug=slugify(this.name,{lower:true})
    console.log('Will save later')
    next()
  })

  ////set some more thing with using pre and save database
  // tourSchema.pre('save',function(){
  //   this.name=`hello ${this.name}`
  //   console.log(this)
  // })
  // tourSchema.post('save',function(doc,next){
  //  console.log(doc)
  //  next()
  // })

  //Query MiddleWare /find/ use for all type find query like findOne findOneAndDelete it is like global find picker
  tourSchema.pre(/find/,function(next){
  // tourSchema.pre('find',function(next){
    console.log('from query middleware')
    this.where({secretTour:{$ne:true}})
    this.startDates=Date.now()
    next()
  })

  tourSchema.post(/find/,function(docs,next){
   console.log(` Query took ${Date.now()-this.startDates} milliseccond`)
   next()
  })
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;

//notes  from section 8 last part
// 1=>we can also use  third patry validtor for check eamil and password also only string or number:npm i validator 
//1=> double back slash /find/ is use to targeting all types of find query

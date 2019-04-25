const Validator=require('validator');
const isEmpty =require('./is-empty');

module.exports=function validateRegisterInput(data){
  let errors={};
  if(!Validator.isLength(data.name,{min:2, max:30})){
   errors.name='Name must be between 2 and 30 characters';
  }
  if(!Validator.isEmail(data.email)){
   errors.email='Email not valid';
  }
  if(!Validator.isLength(data.password,{min:5})){
   errors.password='Password must be min 5 characters';
  }

  return{
    errors,
    isValid: isEmpty(errors)
  };
};
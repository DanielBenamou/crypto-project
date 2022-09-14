import swal from 'sweetalert';

const signUp =document.getElementById('signUp');
const value = document.getElementById('inputZip');
const value2 = document.getElementById('inputEmail4');
const value3 = document.getElementById('inputPassword4');
const value4 = document.getElementById('inputAddress');
const value5 = document.getElementById('inputAddress2');
const value6 = document.getElementById('gridCheck');
const value7 = document.getElementById('inputCity');


signUp.addEventListener('click',() => {
if(value.value === "" || value2.value === "" || value3.value === " " || value4.value === " " || value5.value === " " || value6.value === " " || value7.value === " "){
    alert("Please enter a valid email address");
}
else{
    alert("Sign up successfully")
}
})


'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-01T13:15:33.035Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-07-24T14:43:26.374Z',
    '2020-07-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////

//dates
const formatMovementDate = function(date,locale){
  
  const calcDayPassed = (date1,date2)=> 
   Math.round(Math.abs(date2-date1)/ (1000 * 60 * 60 *24));

   const daysPassed = calcDayPassed(new Date(), date);

   if(daysPassed === 0) return'Today';
   if(daysPassed === 1) return'Yesterday';
   if(daysPassed <= 7) return`${daysPassed}days ago`;
  //  else{
  //   const day = `${date.getDay()}`.padStart(2,0);
  //   const month = `${date.getMonth()+1}`.padStart(2,0);
  //   const year = date.getFullYear();
  //    return`${day}/${month}/${year}`;
  //  }

  return new Intl.DateTimeFormat(locale).format(date);

    
    
}

//format currency
const formatCur = function(value,locale,currency)
{
  return new Intl.NumberFormat(locale,{
    style: 'currency',
    currency: currency,
  }).format(value);
}
//display movements
const displayMovements = function(acc , sort=false){
  
  //like textContent to empty all elememts before
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a,b)=>
  a-b) : acc.movements;

  movs.forEach(function(mov,i){

    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale,
      acc.currency);

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">
    ${i+1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    
    <div class="movements__value">${formattedMov}</div>
  </div>   `;

  containerMovements.insertAdjacentHTML('afterbegin',html);
  });
}

displayMovements(account1);

//total balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.
  reduce((acc, mov) => acc + mov, 0);
  

  labelBalance.textContent = formatCur(acc.balance, acc.locale,
    acc.currency);
};


//display summary at end
const calcDisplaySummary = function(acc){

  const incomes = acc.movements
    .filter(mov=> mov > 0)
    .reduce((acc,mov) => acc+mov , 0);
    labelSumIn.textContent = formatCur(incomes, acc.locale,
      acc.currency);

  const out = acc.movements
    .filter(mov=> mov<0)
    .reduce((acc,mov)=> acc+mov , 0);
    labelSumOut.textContent = formatCur(Math.abs(out), acc.locale,
      acc.currency); 

  const interest = acc.movements
    .filter(mov =>mov > 0)
    .map(deposit => (deposit * acc.interestRate)/ 100)
    .filter((int,i,arr)=>{
      return int >= 1;
    })
    .reduce((acc,int)=> acc+int,0)
    labelSumInterest.textContent = formatCur(interest, acc.locale,
      acc.currency); 
}
calcDisplaySummary(account1);

//create usernames
const createUsernames = function(accs){
  
  accs.forEach(function(acc){
    acc.username = acc.owner.toLowerCase()
    .split(' ')
    .map(name=> name[0])
    .join('');
  })
  
}
createUsernames(accounts);

//update 
const updateUI = function(acc){
  //display movements
  displayMovements(acc);

  //display balance
  calcDisplayBalance(acc);

  //display summary
  calcDisplaySummary(acc);
}

// login button
let currentAccount,timer;

//fake always logged in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;


// logout timer
const startLogoutTimer = function(){

  const tick = function(){
    const min = String(Math.trunc(time/60)).padStart(2,0);
    const sec = String(time%60).padStart(2,0);

  //print remaining time to UI
  labelTimer.textContent = `${min}:${sec}`;

  //after 0 sec logout user
  if(time === 0)
  {
    clearInterval(timer);
    labelWelcome.textContent = 'Log in to get started';
    containerApp.style.opacity = 0;
  }

  time--;

};
  // set time to 5 min
  let time = 120;

  // call timer every sec
  tick();
  const timer = setInterval(tick,1000);
  return timer;
}




// login button
btnLogin.addEventListener('click', function(e){
  //prevent form from submitting
  e.preventDefault();
  // console.log('login');

currentAccount =  accounts.find(acc => acc.username === 
    inputLoginUsername.value);
console.log(currentAccount);

if(currentAccount?.pin === Number(inputLoginPin.value))
{
  //display UI and message
  labelWelcome.textContent = `Welcome back , 
   ${currentAccount.owner.split(' ')[0]}`;

   containerApp.style.opacity =100;

   //create current date and time
   const now = new Date();
const options = {
  hour: 'numeric',
  minute: 'numeric',
  day : 'numeric',
  month : 'long',
  year: 'numeric',
  weekday : 'long',
};

// const locale = navigator.language;

labelDate.textContent = new Intl.DateTimeFormat
(currentAccount.locale,options).format(now);
// const now = new Date();
// const day = `${now.getDay()}`.padStart(2,0);
// const month = `${now.getMonth()+1}`.padStart(2,0);
// const year = now.getFullYear();
// const hour = now.getHours();
// const min = now.getMinutes();

// labelDate.textContent = `${day}/${month}/${year},
//  ${hour}:${min}`;

 

   //clear input fields
   inputLoginUsername.value = inputLoginPin.value = '';
   inputLoginPin.blur();

   //timer
   if(timer) clearInterval(timer);
   timer = startLogoutTimer();

   updateUI(currentAccount);

  //display movements
  displayMovements(currentAccount);

  //display balance
  calcDisplayBalance(currentAccount);

  //display summary
  calcDisplaySummary(currentAccount);

}

});

//transfer money
btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc=> acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if(amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc?.username !== currentAccount.username){
      //doing the transfer
      currentAccount.movements.push(-amount);
      recieverAcc.movements.push(amount);

      //transfer date
      currentAccount.movementsDates.push(new Date().toISOString());
      recieverAcc.movementsDates.push(new Date().toISOString());

      //update UI
      updateUI(currentAccount);

      //reset timer
      clearInterval(timer);
      timer = startLogoutTimer();
  }


});

//loan
btnLoan.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  if(amount>0 && currentAccount.movements.some(mov =>
    mov >= amount * 0.1)){
      //add movement
      setTimeout(function(){
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.
      push(new Date().toISOString());
      updateUI(currentAccount);

      //reset timer
      clearInterval(timer);
      timer = startLogoutTimer();

    },2500);
  }
  inputLoanAmount.value ='';

})

//close account
btnClose.addEventListener('click', function(e){
  e.preventDefault();

  
  if(inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin){

      const index = accounts.findIndex( acc => acc.username
        === currentAccount.username);

      //delete account  
      accounts.splice(index, 1);

      //hide UI
      containerApp.style.opacity = 100;
    }

    inputCloseUsername.value = inputClosePin.value = '';


})

//sort button
let sorted = false;
btnSort.addEventListener('click',function(e){
  e.preventDefault();
  displayMovements(currentAccount,!sorted);
  sorted = !sorted;
});







/////////////////////////////////////////////////
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

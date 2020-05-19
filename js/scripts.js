'use strict';
// APPLICATION INITIAL STATE

  // HTML elements
  let form = null;
  let searchInput = null;
  let submitButton = null;

  let usersListElement = null;
  let maleUsersElement = null;
  let femaleUsersElement = null;
  let sumOfAgesElement = null;
  let agesfAvgElement = null;

  let usersQty = null;

  // counters
  let totalUsers = 0;
  let maleQty = 0;
  let femaleQty = 0;
  let sumOfAges = 0;
  let agesAvg = 0;

  // arrays
  let allUsers = [];
  let allUsersBackup = [];

  // helpers
  let numberFormat = null;

// APPLICATION
window.addEventListener('load', () => {
  console.log('Application initialized');

  form = document.querySelector('form');
  searchInput = document.querySelector('#searchInput');
  submitButton = document.querySelector('#submitButton');

  usersListElement = document.querySelector('#users');
  maleUsersElement = document.querySelector('#maleUsers');
  femaleUsersElement = document.querySelector('#femaleUsers');
  sumOfAgesElement = document.querySelector('#sumOfAges');
  agesfAvgElement = document.querySelector('#agesAvg');

  usersQty = document.querySelector('#usersQty');
  // console.log(femaleUsers);

  numberFormat = Intl.NumberFormat('pt-BR');
  preventFormSubmit();
  fetchUsers();
});

async function fetchUsers() {
  const res = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
  const data = await res.json();
  
  allUsersBackup = data.results.map(person => {    
    return {
      id: person.login.uuid,
      name: `${person.name.first} ${person.name.last}`,
      gender: person.gender,
      dob: person.dob,
      photo: person.picture.thumbnail,
    }
  });
  allUsers = allUsersBackup;
  render();
}

function preventFormSubmit() {
  form.addEventListener('submit', event => event.preventDefault());
}

function render() {
  submitButton.disabled = true;
  updateUsersList();
  updateStats();
  searchInput.addEventListener('input', handleButton);
  searchInput.addEventListener('keyup', searchByEnter);
  form.addEventListener('submit', searchByButton);
}

function updateUsersList() {
  let usersHTML = '';
  allUsers.sort((a, b) => a.name.localeCompare(b.name));
  allUsers.forEach(user => {
    let userHTML = `
      <div class='user-card' id=${user.id}>
        <img src='${user.photo}' />
        <span>${user.name}, ${user.dob.age}</span>
      </div>
    `; 
    usersHTML += userHTML;
  });
  usersListElement.innerHTML = usersHTML;
}

function updateStats() {
  // atualizando o total de usuários
  totalUsers = allUsers.length;
  usersQty.textContent = `${totalUsers} usuário(s) encontrado(s)`;

  // atualizando o total de homens na lista
  maleQty = allUsers.filter(user => user.gender !== 'female').length;
  maleUsersElement.textContent = `${maleQty} usuários do sexo masculino `;
  
  // atualizando o total de mulheres na lista
  femaleQty = allUsers.filter(user => user.gender !== 'male').length;
  femaleUsersElement.textContent = `${femaleQty} usuárias do sexo feminino `;

  // atualizando a soma das idades dos usuários da lista
  sumOfAges = allUsers.reduce((accumulator, currentPerson) => {
    return accumulator += currentPerson.dob.age;
  }, 0);
  sumOfAgesElement.textContent = `Soma das idades: ${formatNumber(sumOfAges)} anos`;
  
  // atualizando a média das idades dos usuários da lista
  agesAvg = sumOfAges / allUsers.length;
  agesfAvgElement.textContent = `Média das idades: ${formatNumber(agesAvg)} anos`;
}

function formatNumber(number) {
  return numberFormat.format(number.toFixed(2));
}

function searchByEnter () {
  if(event.key === 'Enter' && (!!searchInput.value.trim())) {
    let search = searchInput.value;
    allUsers = allUsersBackup.filter(user => {
      let userName = user.name.toLowerCase();
      if(userName.indexOf(search) !== -1) return user;
    });
    render();
  }
}

function searchByButton () {
  if(!!searchInput.value.trim()) {
    let search = searchInput.value;
    allUsers = allUsersBackup.filter(user => {
      let userName = user.name.toLowerCase();
      if(userName.indexOf(search) !== -1) return user;
    });
    render();
  }
}

function handleButton() {
  let content = searchInput.value;
  if(content !== null && content !== '') {
    return submitButton.disabled = false;
  } else {
    return submitButton.disabled = true;
  }
}


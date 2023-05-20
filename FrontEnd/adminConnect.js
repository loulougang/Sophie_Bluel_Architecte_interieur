const token = sessionStorage.getItem('token');

if (token) {
	const welcomeMessage = document.getElementById('welcome-message');
	welcomeMessage.textContent = 'Bienvenue ! Vous êtes maintenant authentifié.';
} else {
	window.location.href = 'login.html';
}
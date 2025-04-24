document.getElementById('resetForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const email = document.getElementById('email');
    const newPassword = document.getElementById('new-password');
    const confirmPassword = document.getElementById('confirm-password');
  
    const errorEmail = document.getElementById('error-email');
    const errorNewPassword = document.getElementById('error-new-password');
    const errorConfirmPassword = document.getElementById('error-confirm-password');
    const resultDiv = document.getElementById('result');
  
    [email, newPassword, confirmPassword].forEach(input => input.classList.remove('invalid'));
    [errorEmail, errorNewPassword, errorConfirmPassword].forEach(error => {
      error.textContent = '';
      error.style.display = 'none';
    });
    resultDiv.textContent = '';
    resultDiv.style.color = '';
  
    const emailValue = email.value.trim();
    const newPasswordValue = newPassword.value;
    const confirmPasswordValue = confirmPassword.value;
  
    let hasError = false;
  
    if (!emailValue || !emailValue.includes('@')) {
      email.classList.add('invalid');
      errorEmail.textContent = '❌ Adresse email invalide.';
      errorEmail.style.display = 'block';
      hasError = true;
    }
  
    if (newPasswordValue.length < 8) {
      newPassword.classList.add('invalid');
      errorNewPassword.textContent = '❌ Le mot de passe doit contenir au moins 8 caractères.';
      errorNewPassword.style.display = 'block';
      hasError = true;
    }
  
    if (newPasswordValue !== confirmPasswordValue) {
      confirmPassword.classList.add('invalid');
      newPassword.classList.add('invalid');
      errorConfirmPassword.textContent = '❌ Les mots de passe ne correspondent pas.';
      errorConfirmPassword.style.display = 'block';
      hasError = true;
    }
  
    if (hasError) return;
  
    try {
      const response = await fetch('http://localhost:4000/api/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailValue,
          newPassword: newPasswordValue,
          confirmPassword: confirmPasswordValue
        })
      });
  
      const contentType = response.headers.get('content-type');
      let data;
  
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        throw new Error('Réponse invalide');
      }
  
      if (response.ok) {
        resultDiv.textContent = '✅ ' + (data.message || 'Mot de passe changé avec succès.');
        resultDiv.style.color = 'green';
        document.getElementById('resetForm').reset();
      } else {
        resultDiv.textContent = '❌ ' + (data.error || 'Erreur inconnue.');
        resultDiv.style.color = 'red';
      }
  
    } catch (error) {
      console.error("Erreur fetch :", error);
      resultDiv.textContent = '❌ Erreur de connexion avec le serveur.';
      resultDiv.style.color = 'red';
    }
  });
  
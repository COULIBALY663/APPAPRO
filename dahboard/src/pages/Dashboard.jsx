if (!isAuthenticated) {
    return (
      <div style={styles.authContainer}>
        <div style={styles.authCard}>
          <h2 style={styles.title}>{isRegisterMode ? "Créer un compte" : "Connexion Admin"}</h2>
          <form onSubmit={handleAuthSubmit} style={styles.form}>
            {isRegisterMode && (
              <>
                <input style={styles.input} placeholder="Nom" onChange={(e) => setForm({...form, nom: e.target.value})} required />
                <input style={styles.input} placeholder="Prénom" onChange={(e) => setForm({...form, prenom: e.target.value})} required />
              </>
            )}
            <input type="email" style={styles.input} placeholder="E-mail" onChange={(e) => setForm({...form, email: e.target.value})} required />
            <input type="password" style={styles.input} placeholder="Mot de passe" onChange={(e) => setForm({...form, password: e.target.value})} required />
            
            {isRegisterMode && <input type="password" style={styles.input} placeholder="Confirmer mot de passe" onChange={(e) => setForm({...form, confirmPassword: e.target.value})} required />}
            <button type="submit" style={styles.button}>{isRegisterMode ? "S'inscrire" : "Se connecter"}</button>
          </form>
          <p onClick={() => setIsRegisterMode(!isRegisterMode)} style={styles.toggleText}>
            {isRegisterMode ? "Déjà un compte ? Connexion" : "Pas de compte ? S'inscrire"}
          </p>
        </div>
      </div>
    );
  }
import AvatarWelcome from '../components/AvatarWelcome';

function WelcomeView() {
  return (
    <div className="welcome-view fade-in">
      {/* Welcome Banner */}
      <div className="welcome-hero glass">
        <div className="welcome-badge">
          <span>Immersion Française • 9e Année</span>
        </div>
        <h1>Bienvenue sur Français immersion 9</h1>
        <p className="welcome-subtitle">
          Votre espace interactif pour maîtriser le français, explorer la culture francophone et développer votre confiance à l'oral et à l'écrit.
        </p>

        {/* Interactive Avatars Jasmine & Kader */}
        <AvatarWelcome />
      </div>
    </div>
  );
}

export default WelcomeView;

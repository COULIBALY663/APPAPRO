import React from 'react';
import { 
  ShieldCheck, 
  Rocket, 
  Users, 
  Handshake, 
  Target, 
  Eye, 
  FileText, 
  Award, 
  Clock, 
  Smile, 
  Lock, 
  Zap, 
  Mail,
  Phone,
  MapPin,
  Globe
} from 'lucide-react';
import './Propos.css'; // Importation du fichier CSS classique

export default function Propos() {
  return (
    <div className="propos-container">
      
      {/* En-tête / Titre */}
      <header className="propos-header">
        <span className="propos-badge" style={{ backgroundColor: '#16a34a', color: '#fff', fontSize: '60px', padding: '5px 10px', borderRadius: '5px' }}>
          À propos d'Academy Pro
        </span>
        <h1>Votre partenaire pour tous vos besoins numériques.</h1>
        <p>
          Academy Pro est une plateforme de services numériques conçue pour répondre aux besoins des particuliers, des étudiants, des professionnels et des entreprises. Nous proposons des solutions innovantes, rapides, sécurisées et accessibles à tous.
        </p>
      </header>

      {/* Mission & Vision */}
      <section className="propos-grid-2">
        <div className="propos-card">
          <div className="propos-card-title">
            <Target size={24} />
            <h2>Notre Mission</h2>
          </div>
          <p>Offrir des services numériques fiables, rapides et accessibles afin de simplifier le quotidien de nos utilisateurs.</p>
        </div>

        <div className="propos-card">
          <div className="propos-card-title">
            <Eye size={24} />
            <h2>Notre Vision</h2>
          </div>
          <p>Devenir la plateforme numérique de référence en Afrique, reconnue pour la qualité de ses services, son innovation et son engagement auprès de ses clients.</p>
        </div>
      </section>

      {/* Nos Services */}
      <section>
        <h2>Nos Services</h2>
        <div className="propos-grid-services">
          <div className="propos-service-item">
            <FileText size={24} />
            <div>
              <h3>Documents Administratifs</h3>
              <p>Faites vos demandes de documents officiels en toute simplicité.</p>
            </div>
          </div>

          <div className="propos-service-item">
            <ShieldCheck size={24} />
            <div>
              <h3>Marché PC</h3>
              <p>Achetez ou vendez du matériel informatique en toute sécurité.</p>
            </div>
          </div>

          <div className="propos-service-item">
            <Users size={24} />
            <div>
              <h3>Assistance & Support</h3>
              <p>Bénéficiez de l'aide de nos experts à tout moment.</p>
            </div>
          </div>

          <div className="propos-service-item">
            <Award size={24} />
            <div>
              <h3>Certificats en Ligne</h3>
              <p>Obtenez vos certificats rapides et en quelques clics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section>
        <h2>Nos Valeurs</h2>
        <div className="propos-grid-values">
          <div className="propos-value-box">
            <Zap size={24} />
            <h3>Innovation</h3>
            <p>Des solutions modernes et performantes.</p>
          </div>

          <div className="propos-value-box">
            <ShieldCheck size={24} />
            <h3>Sécurité</h3>
            <p>Vos données et transactions protégées.</p>
          </div>

          <div className="propos-value-box">
            <Users size={24} />
            <h3>Accompagnement</h3>
            <p>Une équipe à votre écoute au quotidien.</p>
          </div>

          <div className="propos-value-box">
            <Handshake size={24} />
            <h3>Confiance</h3>
            <p>Engagés pour votre entière satisfaction.</p>
          </div>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="propos-stats">
        <div>
          <Clock size={24} />
          <div className="stat-number">24/7</div>
          <div className="stat-label">Service client</div>
        </div>
        <div>
          <Smile size={24} />
          <div className="stat-number">+5000</div>
          <div className="stat-label">Utilisateurs satisfaits</div>
        </div>
        <div>
          <Lock size={24} />
          <div className="stat-number">100%</div>
          <div className="stat-label">Sécurisé</div>
        </div>
        <div>
          <Rocket size={24} />
          <div className="stat-number">Rapide</div>
          <div className="stat-label">Traitement express</div>
        </div>
      </section>

      {/* Contact / Pied de page */}
      <footer className="propos-footer">
        <div className="footer-item"><Mail size={14} /> <span>academypro@gmail.com</span></div>
        <div className="footer-item"><Phone size={14} /> <span>+225 05 64 22 51 78</span></div>
        <div className="footer-item"><MapPin size={14} /> <span>Korhogo, Côte d'Ivoire</span></div>
        <div className="footer-item"><Globe size={14} /> <span>www.academypro.ci</span></div>
      </footer>

    </div>
  );
}
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './App.css';

// 🔹 Données réalistes pour une appli de transfert d'argent
const DONNEES_TRANSACTIONS_EXEMPLES = [
  { id: 1, destinataire: "Moussa Bouabré", montant: 50000, status: "success", date: "2025-01-15" },
  { id: 2, destinataire: "Marie Anne", montant: 25000, status: "pending", date: "2025-01-20" },
  { id: 3, destinataire: "Compte Perso", montant: 150000, status: "failed", date: "2025-01-10" },
  { id: 4, destinataire: "Issouf Sangaré", montant: 75000, status: "success", date: "2025-01-18" }
];

// ✅ CORRIGÉ : Déplacé hors du composant pour référence stable
const MOCK_TRANSFERTS_API = [
  {
    id: 101,
    destinataire: "Awa Konaté",
    telephone: "+225 07 88 77 66",
    pays: "Côte d'Ivoire",
    montant: 45000,
    devise: "XOF",
    status: "completed",
    date: "2025-01-20T10:30:00Z",
    commission: 2.5,
    mode: "Mobile Money"
  },
  {
    id: 102,
    destinataire: "Fatou Diop",
    telephone: "+221 77 123 45 67",
    pays: "Sénégal",
    montant: 25000,
    devise: "XOF",
    status: "pending",
    date: "2025-01-20T14:15:00Z",
    commission: 2.5,
    mode: "Cash"
  },
  {
    id: 103,
    destinataire: "Mamadou Camara",
    telephone: "+224 62 98 76 54",
    pays: "Guinée",
    montant: 125000,
    devise: "GNF",
    status: "completed",
    date: "2025-01-19T09:45:00Z",
    commission: 3.5,
    mode: "Banque"
  }
];

function App() {
  return (
    <div className="App">
      <header className="entete-app">
        <h1>💸 Easy Transfert</h1>
        <p className="accroche">Vos envois d'argent en toute simplicité</p>
      </header>

      <ListeTransactions />
      <SectionApiTransferts />
      <AmeliorationsUX />
    </div>
  );
}

// 🔹 TEST 1 : Interface de transactions premium
function ListeTransactions() {
  const [transactions] = useState(DONNEES_TRANSACTIONS_EXEMPLES);
  const [filter, setFilter] = useState('all');

  const transactionsAffichees = useMemo(() => {
    if (filter === 'all') return transactions;
    return transactions.filter(t => t.status === filter);
  }, [filter, transactions]);

  const obtenirStyleStatut = (status) => {
    const styles = {
      success: { bg: '#d1fae5', color: '#065f46', label: '✅ Complété' },
      pending: { bg: '#fef3c7', color: '#92400e', label: '⏳ En attente' },
      failed: { bg: '#fee2e2', color: '#991b1b', label: '❌ Échoué' }
    };
    return styles[status] || styles.failed;
  };

  return (
    <section className="section-transactions">
      <div className="entete-section">
        <h2>📊 Historique de vos envois</h2>
        <div className="onglets-filtre">
          <button className={filter === 'all' ? 'actif' : ''} onClick={() => setFilter('all')}>Tout</button>
          <button className={filter === 'success' ? 'actif' : ''} onClick={() => setFilter('success')}>Réussis</button>
          <button className={filter === 'pending' ? 'actif' : ''} onClick={() => setFilter('pending')}>En cours</button>
        </div>
      </div>

      <div className="conteneur-transactions">
        {transactionsAffichees.map(t => {
          const status = obtenirStyleStatut(t.status);
          return (
            <div 
              key={t.id} 
              className={`carte-transaction statut-${t.status}`}
              role="article"
              aria-label={`Envoi vers ${t.destinataire}`}
            >
              <div className="principal-transaction">
                <div className="info-transaction">
                  <h3>{t.destinataire}</h3>
                  <time dateTime={t.date}>
                    {new Date(t.date).toLocaleDateString('fr-FR', { 
                      weekday: 'short', day: 'numeric', month: 'short' 
                    })}
                  </time>
                </div>
                <div className="montant-transaction">
                  <span className="montant-valeur">
                    {t.montant.toLocaleString('fr-FR')}
                  </span>
                  <span className="devise">Fcfa</span>
                </div>
              </div>
              
              <div className="pied-transaction">
                <span 
                  className="badge-statut"
                  style={{ background: status.bg, color: status.color }}
                >
                  {status.label}
                </span>
                <div className="actions">
                  <button className="btn btn-fantome" aria-label={`Détails de ${t.destinataire}`}>
                    ℹ️ Détails
                  </button>
                  {t.status === 'pending' && (
                    <button className="btn btn-erreur" aria-label={`Annuler envoi vers ${t.destinataire}`}>
                      🚫 Annuler
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// 🔹 TEST 2 : API avec données réalistes de transferts
function SectionApiTransferts() {
  const [transferts, setTransferts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ CORRIGÉ : Plus de dépendance changeante, MOCK_TRANSFERTS_API est stable
  const fetchTransferts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (Math.random() > 0.9) throw new Error("Erreur réseau");
      setTransferts(MOCK_TRANSFERTS_API);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []); // ✅ Dépendances vides = callback stable

  // ✅ CORRIGÉ : useEffect avec dépendance stable
  useEffect(() => {
    fetchTransferts();
  }, [fetchTransferts]);

  if (loading) {
    return (
      <section className="section-api">
        <h2>🌍 Transferts en temps réel (API)</h2>
        <div className="etat-chargement">
          <div className="spinner" aria-label="Chargement"></div>
          <p>Connexion au serveur sécurisé...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-api">
        <h2>🌍 Transferts en temps réel (API)</h2>
        <div className="etat-erreur" role="alert">
          <span className="icone-erreur">⚠️</span>
          <p><strong>Erreur :</strong> {error}</p>
          <button onClick={fetchTransferts} className="btn btn-reessayer">
            🔄 Réessayer
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="section-api">
      <div className="entete-section">
        <h2>🌍 Transferts en temps réel (API)</h2>
        <button onClick={fetchTransferts} className="btn btn-primaire" aria-label="Rafraîchir">
          🔄 Actualiser
        </button>
      </div>
      
      <div className="grille-transferts">
        {transferts.map(t => (
          <article key={t.id} className={`carte-transferts statut-${t.status}`}>
            <div className="entete-transfert">
              <h3>{t.destinataire}</h3>
              <span className="badge-pays">{t.pays}</span>
            </div>
            
            <div className="details-transfert">
              <p className="montant-api">
                <span className="valeur">{t.montant.toLocaleString('fr-FR')}</span>
                <span className="devise">{t.devise}</span>
              </p>
              <p className="mode-paiement">💳 {t.mode}</p>
              <p className="commission">Frais: {t.commission}%</p>
            </div>

            <div className="pied-transfert">
              <time>{new Date(t.date).toLocaleString('fr-FR', { 
                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
              })}</time>
              <span className={`badge-statut ${t.status}`}>
                {t.status === 'completed' ? '✅ Livré' : '⏳ En cours'}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// 🔹 TEST 3 : Améliorations UX détaillées et spécifiques
function AmeliorationsUX() {
  return (
    <section className="section-ux">
      <h2>💡 3 améliorations UX pour vos utilisateurs</h2>
      <ol className="liste-ux">
        <li>
          <strong>🔒 Processus en 3 étapes avec assistant vocal intégré</strong>
          <p>Barre de progression visuelle avec <em>photos des étapes</em>. Si l'utilisateur hésite &gt;30 secondes, une aide automatique s'active : popup avec option "Appeler un conseiller" ou "Mode guidé pas-à-pas".</p>
          <div className="exemple-visuel">
            <small>Exemple : Étape 1 → Choisir destinataire (photo du contact) | Étape 2 → Montant (clavier grand format) | Étape 3 → Confirmation (code OTP)</small>
          </div>
        </li>
        <li>
          <strong>✅ Double confirmation intelligente</strong>
          <p>Avant validation finale : affichage d'une <em>"carte récapitulative"</em> avec photo du destinataire (si disponible), coût total, et <em>code OTP envoyé par SMS</em> à l'émetteur ET au destinataire pour les montants &gt; 50 000 FCFA.</p>
        </li>
        <li>
          <strong>♿ Mode "Simplifié" permanent</strong>
          <p>Un bouton visible en haut à droite "Mode Facile" qui : augmente les textes de 30%, simplifie l'interface, active la <em>lecture vocale automatique</em> des montants, et affiche uniquement 3 actions principales.</p>
        </li>
      </ol>
    </section>
  );
}

export default App;
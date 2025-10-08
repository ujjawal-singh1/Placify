import React from 'react';
import './Styles/Companies.css';
import { NavLink } from 'react-router-dom';

const companyList = [
  {
    name: "Accenture",
    overview: "A global IT and consulting firm driving digital transformation across industries.",
    image: "/images/accenture.png"
  },
  {
    name: "Adobe",
    overview: "Leader in creative software, best known for Photoshop, Illustrator, and digital media tools.",
    image: "/images/adobe.png"
  },
  {
    name: "Atlassian",
    overview: "Makers of collaboration tools like Jira and Confluence for agile software teams.",
    image: "/images/atlassian.jpeg"
  },
  {
    name: "Byjus",
    overview: "India's largest edtech company focused on personalized learning platforms.",
    image: "/images/byjus.png"
  },
  {
    name: "Capgemini",
    overview: "A multinational IT consulting firm delivering technology and outsourcing services.",
    image: "/images/capgemini.png"
  },
  {
    name: "Cisco",
    overview: "A global leader in networking, cybersecurity, and enterprise communication solutions.",
    image: "/images/cisco.png"
  },
  {
    name: "Cognizant",
    overview: "IT services and consulting firm helping businesses modernize technology operations.",
    image: "/images/cognizant.png"
  },
  {
    name: "Deloitte",
    overview: "One of the Big Four accounting firms offering audit, consulting, and advisory services.",
    image: "/images/deloitte.png"
  },
  {
    name: "EPAM",
    overview: "Engineering-focused IT company providing product development and digital transformation.",
    image: "/images/epam.png"
  },
  {
    name: "EY",
    overview: "A global professional services firm offering assurance, tax, and advisory services.",
    image: "/images/ey.png"
  },
  {
    name: "Flipkart",
    overview: "One of India’s leading e-commerce platforms acquired by Walmart.",
    image: "/images/flipkart.jpeg"
  },
  {
    name: "GoldmanSachs",
    overview: "A leading global investment banking and financial services firm.",
    image: "/images/goldmansachs.png"
  },
  {
    name: "Hashedin",
    overview: "Product development company now part of Deloitte, focused on cloud and SaaS.",
    image: "/images/hashedin.png"
  },
  {
    name: "HCL",
    overview: "Indian multinational providing IT services and enterprise transformation.",
    image: "/images/hcl.png"
  },
  {
    name: "Hexaware",
    overview: "IT and BPO services provider with expertise in automation and cloud solutions.",
    image: "/images/hexaware.png"
  },
  {
    name: "HP",
    overview: "Technology company offering PCs, printers, and enterprise hardware solutions.",
    image: "/images/hp.png"
  },
  {
    name: "IBM",
    overview: "Global tech giant specializing in cloud computing, AI, and enterprise software.",
    image: "/images/ibm.png"
  },
  {
    name: "Infosys",
    overview: "A leading Indian IT company offering consulting, outsourcing, and digital services.",
    image: "/images/infosys.png"
  },
  {
    name: "Intel",
    overview: "World’s largest semiconductor company known for its processors and chipsets.",
    image: "/images/intel.png"
  },
  {
    name: "JPMorgan",
    overview: "Top-tier investment bank and financial services provider operating globally.",
    image: "/images/jpmorgan.png"
  },
  {
    name: "Mahindra",
    overview: "Indian conglomerate with interests in automotive, IT, and agriculture.",
    image: "/images/mahindra.png"
  },
  {
    name: "Meesho",
    overview: "A social commerce platform enabling small businesses to sell online easily.",
    image: "/images/meesho.jpg"
  },
  {
    name: "Microsoft",
    overview: "Global tech giant behind Windows, Azure, Office, and developer tools.",
    image: "/images/microsoft.png"
  },
  {
    name: "Mindtree",
    overview: "Digital transformation and technology services firm part of LTIMindtree.",
    image: "/images/mindtree.png"
  },
  {
    name: "Oracle",
    overview: "Enterprise software and cloud solutions leader known for its database products.",
    image: "/images/oracle.png"
  },
  {
    name: "Paytm",
    overview: "India's leading digital wallet and fintech platform for payments and services.",
    image: "/images/paytm.png"
  },
  {
    name: "Phillips",
    overview: "Global health technology company focused on diagnostics and consumer health.",
    image: "/images/phillips.png"
  },
  {
    name: "Tcs",
    overview: "India's largest IT services company offering consulting, cloud, and business solutions.",
    image: "/images/tcs.png"
  },
  {
    name: "Uber",
    overview: "Ride-sharing and delivery giant transforming urban mobility globally.",
    image: "/images/uber.png"
  },
  {
    name: "Wipro",
    overview: "Global IT, consulting, and business process services company.",
    image: "/images/wipro.jpg"
  }
];

const Companies = () => {
  return (
    <div className="companies-container">
      <h2>Top Hiring Companies</h2>
      <div className="company-grid">
        {companyList.map((company, idx) => (
          <NavLink
            key={idx}
            to={`/companies/${company.name.toLowerCase()}`}
            className="company-card"
          >
            <div className="company-content">
              <img
                src={company.image}
                alt={`${company.name} logo`}
                className="company-logo"
              />
              <h3>{company.name}</h3>
              <p className="company-overview">{company.overview}</p>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Companies;

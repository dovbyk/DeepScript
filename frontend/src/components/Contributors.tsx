import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type ContributorProps = {
  name: string;
  role: string;
  image?: string;
  isLead?: boolean;
};

const Contributor: React.FC<ContributorProps> = ({ name, role, image, isLead = false }) => (
    <div className={`flex flex-col items-center ${isLead ? 'mb-12' : ''}`}>
    <Avatar className={`${isLead ? 'h-100 w-100' : 'h-60 w-60'} mb-4 border-2 border-accent/50 hover:border-accent transition-all duration-300`}>
      {image ? (
        <AvatarImage src={image} alt={name} className="object-cover" />
      ) : (
        <AvatarFallback className="bg-muted text-muted-foreground">
          {name.split(' ').map(part => part[0]).join('')}
        </AvatarFallback>
      )}
    </Avatar>
    <h3 className={`font-medium ${isLead ? 'text-4xl' : 'text-3xl'}`}>{name}</h3>
    <p className="text-lg text-muted-foreground text-center max-w-[200px]">{role}</p>
  </div>
);

const Contributors: React.FC = () => {
  const leadContributor = {
    name: "Krutika Verma",
    role: "Project Mentor",
    image: "kr.png"
  };

  const contributors = [
    {
      name: "Aryan Sharma Gaire",
      role: "Backend Engineering",
      image: "img3.jpg"
    },
    {
      name: "Abhishek Kumar Yadav",
      role: "Endpoint Management",
      image: "ab.jpeg"
    },
    {
      name: "Bishal Thakur",
      role: "Frontend Engineering",
      image: "b.jpeg"
    },
    {
      name: "Sujit Pangeni",
      role: "Conference Paper Publishment",
      image: "pan.jpeg"
    },
    {
      name: "Pranjal Sharma",
      role: "Conference Paper Publishment",
      image: "pr.jpeg"
    },
    {
      name: "Ankit Dahal",
      role: "UI/UX design",
      image: "an.jpeg"
    }
  ];

  return (
    <div className="glass-panel p-8 animate-fade-in">
       <h2 className="font-agency text-3xl md:text-5xl text-center mb-6">CONTRIBUTORS</h2>
      
      <div className="flex justify-center mb-10">
        <Contributor 
          name={leadContributor.name} 
          role={leadContributor.role} 
          image={leadContributor.image} 
          isLead={true} 
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
        {contributors.map((contributor, index) => (
          <Contributor 
            key={index}
            name={contributor.name}
            role={contributor.role}
            image={contributor.image}
          />
        ))}
      </div>
    </div>
  );
};

export default Contributors;

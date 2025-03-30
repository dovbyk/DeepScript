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
    <h3 className={`font-medium ${isLead ? 'text-2xl' : 'text-base'}`}>{name}</h3>
    <p className="text-sm text-muted-foreground text-center max-w-[200px]">{role}</p>
  </div>
);

const Contributors: React.FC = () => {
  const leadContributor = {
    name: "Alex Johnson",
    role: "Project Lead & Font Engine Architecture",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=300&fit=crop&crop=faces"
  };

  const contributors = [
    {
      name: "Sarah Chen",
      role: "Frontend Development",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=300&fit=crop&crop=faces"
    },
    {
      name: "Michael Peters",
      role: "Backend Integration",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=300&fit=crop&crop=faces"
    },
    {
      name: "Priya Sharma",
      role: "UI/UX Design",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=300&fit=crop&crop=faces"
    },
    {
      name: "David Rodriguez",
      role: "Font Processing Algorithms",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=300&fit=crop&crop=faces"
    },
    {
      name: "Emma Wilson",
      role: "Testing & Quality Assurance",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=300&fit=crop&crop=faces"
    },
    {
      name: "Jamal Thompson",
      role: "Documentation & API Design",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=300&fit=crop&crop=faces"
    }
  ];

  return (
    <div className="glass-panel p-8 animate-fade-in">
       <h2 className="font-agency text-3xl md:text-5xl text-center mb-6">DESCRIPTION</h2>
      
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

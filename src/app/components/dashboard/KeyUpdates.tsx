import React from 'react';
import { Ticket, AlertTriangle, ChevronRight } from 'lucide-react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const KeyUpdates: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="mb-8 overflow-hidden w-full">
      <h2 className="text-lg font-bold text-slate-800 mb-4">Key Updates</h2>
      <div className="-mx-2">
        <Slider {...settings}>
          <div className="px-2">
            <UpdateCard 
              icon={<Ticket className="text-slate-600" />}
              title="Action Required: 4 tickets"
              description="Please add the required details for faster resolution."
            />
          </div>
          <div className="px-2">
            <UpdateCard 
              icon={<AlertTriangle className="text-red-500" />}
              title="Failed: 4 payments of ₹40,000"
              description="Please review the payment details"
              highlight
            />
          </div>
          <div className="px-2">
            <UpdateCard 
              icon={<Ticket className="text-slate-600" />}
              title="Action Required: 4 tickets"
              description="Please add the required details for faster resolution."
            />
          </div>
          <div className="px-2">
            <UpdateCard 
              icon={<AlertTriangle className="text-red-500" />}
              title="Failed: 4 payments of ₹40,000"
              description="Please review the payment details"
              highlight
            />
          </div>
        </Slider>
      </div>
    </div>
  );
};

interface UpdateCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: boolean;
}

const UpdateCard: React.FC<UpdateCardProps> = ({ icon, title, description, highlight }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer group relative">
      <div className="mt-1">{icon}</div>
      <div>
        <div className={`font-medium text-sm mb-1 ${highlight ? 'text-red-600' : 'text-slate-800'}`}>
          {title}
        </div>
        <div className="text-xs text-slate-500 leading-relaxed">
          {description}
        </div>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-slate-100 p-1 rounded-full">
            <ChevronRight size={16} className="text-slate-500" />
        </div>
      </div>
    </div>
  );
};
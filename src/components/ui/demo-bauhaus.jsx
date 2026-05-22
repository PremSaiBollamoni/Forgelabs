import { BauhausCard } from "./bauhaus-card";
import { projects as staticProjects } from "../../data/portfolioData";
import { useNavigate } from "react-router-dom";

export const DemoBauhaus = ({ projects = [] }) => {
  const navigate = useNavigate();
  
  // Use passed projects if available, otherwise fallback to static for safety
  const displayProjects = projects.length > 0 ? projects : staticProjects;
  
  // Select two prominent projects for the demo
  const aiProject = displayProjects[0];
  const textileProject = displayProjects[1];

  return (
    <div className="w-full p-8 rounded-lg flex flex-wrap gap-12 items-center justify-center relative">
      {/* AI Invoice Project Card */}
      {aiProject && (
        <BauhausCard
          id="ai-invoice"
          accentColor="#2D5BFF"
          backgroundColor="var(--bauhaus-card-bg)"
          separatorColor="var(--bauhaus-card-separator)"
          borderRadius="2em"
          borderWidth="2px"
          topInscription="Case Study: AI Automation"
          mainText={aiProject.title}
          subMainText="Intelligent Extraction Pipeline"
          progressBarInscription="Extraction Accuracy:"
          progress={98.4}
          progressValue="98.4%"
          filledButtonInscription="View Case Study"
          outlinedButtonInscription="Contact Us"
          onFilledButtonClick={() => navigate(`/portfolio/${aiProject.slug}`)}
          onOutlinedButtonClick={() => navigate('/contact')}
          mirrored={false}
          swapButtons={false}
          textColorTop="var(--bauhaus-card-inscription-top)"
          textColorMain="var(--bauhaus-card-inscription-main)"
          textColorSub="var(--bauhaus-card-inscription-sub)"
          textColorProgressLabel="var(--bauhaus-card-inscription-progress-label)"
          textColorProgressValue="var(--bauhaus-card-inscription-progress-value)"
          progressBarBackground="var(--bauhaus-card-progress-bar-bg)"
          chronicleButtonBg="var(--bauhaus-chronicle-bg)"
          chronicleButtonFg="var(--bauhaus-chronicle-fg)"
          chronicleButtonHoverFg="var(--bauhaus-chronicle-hover-fg)"
        />
      )}

      {/* Textile Project Card */}
      {textileProject && (
        <BauhausCard
          id="textile-ops"
          accentColor="#10B981"
          backgroundColor="var(--bauhaus-card-bg)"
          separatorColor="var(--bauhaus-card-separator)"
          borderRadius="2em"
          borderWidth="2px"
          topInscription="Case Study: Industrial"
          mainText={textileProject.title}
          subMainText="Supply Chain Optimization"
          progressBarInscription="Production Boost:"
          progress={22}
          progressValue="+22.5%"
          filledButtonInscription="View Case Study"
          outlinedButtonInscription="Bookmark"
          onFilledButtonClick={() => navigate(`/portfolio/${textileProject.slug}`)}
          onOutlinedButtonClick={() => {}}
          mirrored={false}
          swapButtons={false}
          textColorTop="var(--bauhaus-card-inscription-top)"
          textColorMain="var(--bauhaus-card-inscription-main)"
          textColorSub="var(--bauhaus-card-inscription-sub)"
          textColorProgressLabel="var(--bauhaus-card-inscription-progress-label)"
          textColorProgressValue="var(--bauhaus-card-inscription-progress-value)"
          progressBarBackground="var(--bauhaus-card-progress-bar-bg)"
          chronicleButtonBg="var(--bauhaus-chronicle-bg)"
          chronicleButtonFg="var(--bauhaus-chronicle-fg)"
          chronicleButtonHoverFg="#151419"
        />
      )}
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = ({ crumbs = [] }) => {
  if (!crumbs.length) return null;

  return (
    <nav className="flex items-center gap-1.5 text-sm py-3 px-6 border-b border-border bg-surface/60">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <React.Fragment key={crumb.label}>
            {isLast ? (
              <span className="font-medium text-ink">{crumb.label}</span>
            ) : (
              <Link
                to={crumb.href}
                className="text-muted hover:text-ink hover:underline transition-colors"
              >
                {crumb.label}
              </Link>
            )}
            {!isLast && (
              <ChevronRight className="w-3.5 h-3.5 text-muted flex-shrink-0" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;

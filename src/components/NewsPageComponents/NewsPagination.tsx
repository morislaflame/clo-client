import React from 'react';
import { Button } from '@heroui/react';

interface NewsPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const NewsPagination: React.FC<NewsPaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange
}) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-8 flex justify-center">
      <div className="flex gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "solid" : "bordered"}
            size="sm"
            onPress={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default NewsPagination;

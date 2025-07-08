import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ 
  title, 
  searchPlaceholder, 
  onSearch, 
  onMenuClick, 
  actions,
  className 
}) => {
  return (
    <header className={cn("bg-white border-b border-gray-200 px-4 py-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {onSearch && (
            <div className="hidden md:block w-80">
              <SearchBar 
                placeholder={searchPlaceholder} 
                onChange={onSearch}
              />
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            {actions}
          </div>
          
          <Button variant="ghost" size="sm" className="relative">
            <ApperIcon name="Bell" className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-white">3</span>
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
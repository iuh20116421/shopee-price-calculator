import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

interface CategoryData {
  [key: string]: string | CategoryData;
}

interface CategorySelectorProps {
  data: CategoryData;
  onCategorySelect: (categoryPath: string[], fee: string) => void;
  selectedPath: string[];
  maxLevels?: number; // Số cấp tối đa (Shopee Mall: 4, Shopee thường: 2)
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ 
  data, 
  onCategorySelect, 
  selectedPath,
  maxLevels = 4
}) => {
  const [level1Categories, setLevel1Categories] = useState<string[]>([]);
  const [level2Categories, setLevel2Categories] = useState<string[]>([]);
  const [level3Categories, setLevel3Categories] = useState<string[]>([]);
  const [level4Categories, setLevel4Categories] = useState<string[]>([]);
  const [selectedLevel1, setSelectedLevel1] = useState<string>('');
  const [selectedLevel2, setSelectedLevel2] = useState<string>('');
  const [selectedLevel3, setSelectedLevel3] = useState<string>('');
  const [selectedLevel4, setSelectedLevel4] = useState<string>('');

  // Khởi tạo danh sách cấp 1
  useEffect(() => {
    const categories = Object.keys(data);
    setLevel1Categories(categories);
  }, [data]);

  // Đồng bộ với selectedPath từ bên ngoài (từ search)
  useEffect(() => {
    // Reset tất cả các level trước
    setSelectedLevel1('');
    setSelectedLevel2('');
    setSelectedLevel3('');
    setSelectedLevel4('');
    setLevel2Categories([]);
    setLevel3Categories([]);
    setLevel4Categories([]);
    
    if (selectedPath && selectedPath.length > 0) {
      // Set các level tương ứng
      if (selectedPath.length >= 1) {
        setSelectedLevel1(selectedPath[0]);
        
        // Load level 2 nếu có
        if (selectedPath.length >= 2 && data[selectedPath[0]] && typeof data[selectedPath[0]] === 'object') {
          const level1Data = data[selectedPath[0]] as CategoryData;
          const level2Categories = Object.keys(level1Data);
          setLevel2Categories(level2Categories);
          setSelectedLevel2(selectedPath[1]);
          
          // Load level 3 nếu có
          if (selectedPath.length >= 3 && level1Data[selectedPath[1]] && typeof level1Data[selectedPath[1]] === 'object') {
            const level2Data = level1Data[selectedPath[1]] as CategoryData;
            const level3Categories = Object.keys(level2Data);
            setLevel3Categories(level3Categories);
            setSelectedLevel3(selectedPath[2]);
            
            // Load level 4 nếu có
            if (selectedPath.length >= 4 && level2Data[selectedPath[2]] && typeof level2Data[selectedPath[2]] === 'object') {
              const level3Data = level2Data[selectedPath[2]] as CategoryData;
              const level4Categories = Object.keys(level3Data);
              setLevel4Categories(level4Categories);
              setSelectedLevel4(selectedPath[3]);
            }
          }
        }
      }
    }
  }, [selectedPath, data]);

  // Xử lý chọn category cấp 1
  const handleLevel1Select = (category: string) => {
    setSelectedLevel1(category);
    setSelectedLevel2('');
    setSelectedLevel3('');
    setSelectedLevel4('');
    setLevel2Categories([]);
    setLevel3Categories([]);
    setLevel4Categories([]);
    
    // Kiểm tra xem có subcategories không
    if (hasSubcategories(category, 1)) {
      const subcategories = Object.keys(data[category] as CategoryData);
      setLevel2Categories(subcategories);
    } else {
      // Nếu không có subcategories, đây là category cuối cùng
      const fee = data[category] as string;
      onCategorySelect([category], fee);
    }
  };

  // Xử lý chọn category cấp 2
  const handleLevel2Select = (category: string) => {
    setSelectedLevel2(category);
    setSelectedLevel3('');
    setSelectedLevel4('');
    setLevel3Categories([]);
    setLevel4Categories([]);
    
    if (hasSubcategories(category, 2)) {
      const level1Data = data[selectedLevel1] as CategoryData;
      const subcategories = Object.keys(level1Data[category] as CategoryData);
      setLevel3Categories(subcategories);
    } else {
      // Nếu không có subcategories, đây là category cuối cùng
      const level1Data = data[selectedLevel1] as CategoryData;
      const fee = level1Data[category] as string;
      onCategorySelect([selectedLevel1, category], fee);
    }
  };

  // Xử lý chọn category cấp 3
  const handleLevel3Select = (category: string) => {
    setSelectedLevel3(category);
    setSelectedLevel4('');
    setLevel4Categories([]);
    
    if (hasSubcategories(category, 3)) {
      const level1Data = data[selectedLevel1] as CategoryData;
      const level2Data = level1Data[selectedLevel2] as CategoryData;
      const subcategories = Object.keys(level2Data[category] as CategoryData);
      setLevel4Categories(subcategories);
    } else {
      // Nếu không có subcategories, đây là category cuối cùng
      const level1Data = data[selectedLevel1] as CategoryData;
      const level2Data = level1Data[selectedLevel2] as CategoryData;
      const fee = level2Data[category] as string;
      onCategorySelect([selectedLevel1, selectedLevel2, category], fee);
    }
  };

  // Xử lý chọn category cấp 4
  const handleLevel4Select = (category: string) => {
    setSelectedLevel4(category);
    
    const level1Data = data[selectedLevel1] as CategoryData;
    const level2Data = level1Data[selectedLevel2] as CategoryData;
    const level3Data = level2Data[selectedLevel3] as CategoryData;
    const fee = level3Data[category] as string;
    onCategorySelect([selectedLevel1, selectedLevel2, selectedLevel3, category], fee);
  };

  // Kiểm tra xem category có subcategories không
  const hasSubcategories = (category: string, level: number): boolean => {
    if (level === 1) {
      return !!(data[category] && typeof data[category] === 'object');
    } else if (level === 2 && selectedLevel1) {
      const level1Data = data[selectedLevel1] as CategoryData;
      return !!(level1Data[category] && typeof level1Data[category] === 'object');
    } else if (level === 3 && selectedLevel1 && selectedLevel2) {
      const level1Data = data[selectedLevel1] as CategoryData;
      const level2Data = level1Data[selectedLevel2] as CategoryData;
      return !!(level2Data[category] && typeof level2Data[category] === 'object');
    }
    return false;
  };

  // Kiểm tra xem category có được chọn không
  const isSelected = (category: string, level: number): boolean => {
    if (level === 1) return selectedLevel1 === category;
    if (level === 2) return selectedLevel2 === category;
    if (level === 3) return selectedLevel3 === category;
    if (level === 4) return selectedLevel4 === category;
    return false;
  };

  // Tính toán số cột hiện tại để áp dụng layout động
  const getCurrentColumns = () => {
    if (level4Categories.length > 0) return 4;
    if (level3Categories.length > 0) return 3;
    if (level2Categories.length > 0) return 2;
    return 1;
  };

  const currentColumns = getCurrentColumns();

  return (
    <div className="category-selector">
      <div className={`category-columns columns-${currentColumns}`}>
        {/* Cột cấp 1 */}
        <div className="category-column">
          <div className="category-column-header">Cấp 1</div>
          <div className="category-list">
            {level1Categories.map((category) => (
              <div
                key={category}
                className={`category-item ${isSelected(category, 1) ? 'selected' : ''}`}
                onClick={() => handleLevel1Select(category)}
              >
                <span className="category-name">{category}</span>
                {hasSubcategories(category, 1) && (
                  <ChevronRight className="category-arrow" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cột cấp 2 - chỉ hiển thị khi có dữ liệu */}
        {level2Categories.length > 0 && (
          <div className="category-column">
            <div className="category-column-header">Cấp 2</div>
            <div className="category-list">
              {level2Categories.map((category) => (
                <div
                  key={category}
                  className={`category-item ${isSelected(category, 2) ? 'selected' : ''}`}
                  onClick={() => handleLevel2Select(category)}
                >
                  <span className="category-name">{category}</span>
                  {hasSubcategories(category, 2) && (
                    <ChevronRight className="category-arrow" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cột cấp 3 - chỉ hiển thị khi có dữ liệu và maxLevels >= 3 */}
        {level3Categories.length > 0 && maxLevels >= 3 && (
          <div className="category-column">
            <div className="category-column-header">Cấp 3</div>
            <div className="category-list">
              {level3Categories.map((category) => (
                <div
                  key={category}
                  className={`category-item ${isSelected(category, 3) ? 'selected' : ''}`}
                  onClick={() => handleLevel3Select(category)}
                >
                  <span className="category-name">{category}</span>
                  {hasSubcategories(category, 3) && (
                    <ChevronRight className="category-arrow" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cột cấp 4 - chỉ hiển thị khi có dữ liệu và maxLevels >= 4 */}
        {level4Categories.length > 0 && maxLevels >= 4 && (
          <div className="category-column">
            <div className="category-column-header">Cấp 4</div>
            <div className="category-list">
              {level4Categories.map((category) => (
                <div
                  key={category}
                  className={`category-item ${isSelected(category, 4) ? 'selected' : ''}`}
                  onClick={() => handleLevel4Select(category)}
                >
                  <span className="category-name">{category}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySelector; 
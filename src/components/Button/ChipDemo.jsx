import React, { useState } from 'react';
import Chip from './Chip';
import { FiHome, FiX, FiChevronDown } from 'react-icons/fi';

const ChipDemo = () => {
  const [selectedChip1, setSelectedChip1] = useState(false);
  const [selectedChip2, setSelectedChip2] = useState(false);
  const [dropdownChip1, setDropdownChip1] = useState(false);
  const [dropdownChip2, setDropdownChip2] = useState(false);

  return (
    <div className="bg-gray-50 py-12 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800">Chips</h1>
          <p className="text-xl text-gray-600 mt-2">Reusable Chip Components</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
            
            {/* Column 1: Chips with Close Icon */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-6">Selection Chips (with Close)</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Default (No Icon)</p>
                  <Chip onClick={() => alert('Default chip clicked')}>Default</Chip>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Default (With Icon)</p>
                  <Chip leftIcon={<FiHome />} onClick={() => alert('Default chip with icon clicked')}>
                    Default
                  </Chip>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Focused/Selected (No Icon)</p>
                  <Chip 
                    isFocused={selectedChip1}
                    onClick={() => setSelectedChip1(!selectedChip1)}
                    focusedStyleType="selected"
                    rightIcon={<FiX size={16} />}
                    onRightIconClick={() => {setSelectedChip1(false); alert('Chip 1 deselected');}}
                    rightIconAriaLabel="Deselect chip 1"
                  >
                    Focused
                  </Chip>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Focused/Selected (With Icon)</p>
                  <Chip 
                    leftIcon={<FiHome />}
                    isFocused={selectedChip2}
                    onClick={() => setSelectedChip2(!selectedChip2)}
                    focusedStyleType="selected"
                    rightIcon={<FiX size={16} />}
                    onRightIconClick={() => {setSelectedChip2(false); alert('Chip 2 deselected');}}
                    rightIconAriaLabel="Deselect chip 2"
                  >
                    Focused
                  </Chip>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Disabled (No Icon)</p>
                  <Chip disabled>Disabled</Chip>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Disabled (With Icon)</p>
                  <Chip leftIcon={<FiHome />} disabled>Disabled</Chip>
                </div>
                 <div>
                  <p className="text-sm text-gray-500 mb-1">Disabled Focused (With Icon)</p>
                  <Chip leftIcon={<FiHome />} disabled isFocused focusedStyleType="selected" rightIcon={<FiX size={16} />}>Disabled</Chip>
                </div>
              </div>
            </div>

            {/* Column 2: Chips with Dropdown Icon */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-6">Action Chips (with Dropdown)</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Default (No Icon)</p>
                  <Chip 
                    rightIcon={<FiChevronDown size={16} />}
                    onRightIconClick={() => alert('Dropdown 1 clicked')}
                    onClick={() => alert('Chip part of dropdown 1 clicked')}
                    rightIconAriaLabel="Open dropdown 1"
                  >
                    Default
                  </Chip>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Default (With Icon)</p>
                  <Chip 
                    leftIcon={<FiHome />}
                    rightIcon={<FiChevronDown size={16} />}
                    onRightIconClick={() => alert('Dropdown 2 clicked')}
                    onClick={() => alert('Chip part of dropdown 2 clicked')}
                    rightIconAriaLabel="Open dropdown 2"
                  >
                    Default
                  </Chip>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Focused (No Icon)</p>
                  <Chip 
                    isFocused={dropdownChip1}
                    onClick={() => setDropdownChip1(!dropdownChip1)}
                    focusedStyleType="default"
                    rightIcon={<FiChevronDown size={16} />}
                    onRightIconClick={() => alert('Dropdown 3 clicked')}
                    rightIconAriaLabel="Open dropdown 3"
                  >
                    Focused
                  </Chip>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Focused (With Icon)</p>
                  <Chip 
                    leftIcon={<FiHome />}
                    isFocused={dropdownChip2}
                    onClick={() => setDropdownChip2(!dropdownChip2)}
                    focusedStyleType="default"
                    rightIcon={<FiChevronDown size={16} />}
                    onRightIconClick={() => alert('Dropdown 4 clicked')}
                    rightIconAriaLabel="Open dropdown 4"
                  >
                    Focused
                  </Chip>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Disabled (No Icon)</p>
                  <Chip disabled rightIcon={<FiChevronDown size={16} />}>Disabled</Chip>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Disabled (With Icon)</p>
                  <Chip leftIcon={<FiHome />} disabled rightIcon={<FiChevronDown size={16} />}>Disabled</Chip>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Disabled Focused (With Icon)</p>
                  <Chip leftIcon={<FiHome />} disabled isFocused focusedStyleType="default" rightIcon={<FiChevronDown size={16} />}>Disabled</Chip>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ChipDemo;

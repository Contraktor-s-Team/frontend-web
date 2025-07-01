import React from 'react';
import Button from './Button';
import { 
  FiPlus, 
  FiTrash2, 
  FiDownload,
  FiX,
  FiMoreHorizontal
} from 'react-icons/fi';

const ButtonDemo = () => {

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Button Component</h1>
      
      {/* Destructive Buttons Section */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Destructive Buttons</h2>
        
        {/* Destructive Primary */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 text-gray-700">Destructive Primary</h3>
          
          {/* Regular Buttons */}
          <div className="mb-8">
            <h4 className="text-md font-medium mb-3 text-gray-600">With Text</h4>
            <div className="flex flex-wrap items-center gap-4">
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Default</div>
                <Button variant="destructive-pri" leftIcon={<FiTrash2 />}>
                  Delete Item
                </Button>
              </div>
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Hover</div>
                <Button variant="destructive-pri" className="" leftIcon={<FiTrash2 />}>
                  Delete Item
                </Button>
              </div>
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Focused</div>
                <Button variant="destructive-pri" className="" leftIcon={<FiTrash2 />}>
                  Delete Item
                </Button>
              </div>
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Disabled</div>
                <Button variant="destructive-pri" disabled leftIcon={<FiTrash2 />}>
                  Delete Item
                </Button>
              </div>
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Large</div>
                <Button variant="destructive-pri" size="large" leftIcon={<FiTrash2 />}>
                  Delete Item
                </Button>
              </div>
            </div>
          </div>
          
          {/* Icon Only Buttons */}
          <div>
            <h4 className="text-md font-medium mb-3 text-gray-600">Icon Only</h4>
            <div className="flex flex-wrap items-center gap-4">
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Default</div>
                <Button variant="destructive-pri" iconOnly leftIcon={<FiTrash2 />} aria-label="Delete" />
              </div>
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Hover</div>
                <Button variant="destructive-pri" className="" iconOnly leftIcon={<FiTrash2 />} aria-label="Delete" />
              </div>
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Focused</div>
                <Button variant="destructive-pri" className="" iconOnly leftIcon={<FiTrash2 />} aria-label="Delete" />
              </div>
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Disabled</div>
                <Button variant="destructive-pri" disabled iconOnly leftIcon={<FiTrash2 />} aria-label="Delete" />
              </div>
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Large</div>
                <Button variant="destructive-pri" size="large" iconOnly leftIcon={<FiTrash2 />} aria-label="Delete" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Destructive Secondary */}
        <div>
          <h3 className="text-lg font-medium mb-4 text-gray-700">Destructive Secondary</h3>
          
          {/* Regular Buttons */}
          <div className="mb-8">
            <h4 className="text-md font-medium mb-3 text-gray-600">With Text</h4>
            <div className="flex flex-wrap items-center gap-4">
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Default</div>
                <Button variant="destructive-sec" leftIcon={<FiX />}>
                  Cancel
                </Button>
              </div>
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Hover</div>
                <Button variant="destructive-sec" leftIcon={<FiX />}>
                  Cancel
                </Button>
              </div>
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Focused</div>
                <Button variant="destructive-sec" leftIcon={<FiX />}>
                  Cancel
                </Button>
              </div>
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Disabled</div>
                <Button variant="destructive-sec" disabled leftIcon={<FiX />}>
                  Cancel
                </Button>
              </div>
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Large</div>
                <Button variant="destructive-sec" size="large" leftIcon={<FiX />}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
          
          {/* Icon Only Buttons */}
          <div>
            <h4 className="text-md font-medium mb-3 text-gray-600">Icon Only</h4>
            <div className="flex flex-wrap items-center gap-4">
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Default</div>
                <Button variant="destructive-sec" iconOnly leftIcon={<FiX />} aria-label="Cancel" />
              </div>
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Hover</div>
                <Button variant="destructive-sec" iconOnly leftIcon={<FiX />} aria-label="Cancel" />
              </div>
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Focused</div>
                <Button variant="destructive-sec" iconOnly leftIcon={<FiX />} aria-label="Cancel" />
              </div>
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Disabled</div>
                <Button variant="destructive-sec" disabled iconOnly leftIcon={<FiX />} aria-label="Cancel" />
              </div>
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Large</div>
                <Button variant="destructive-sec" size="large" iconOnly leftIcon={<FiX />} aria-label="Cancel" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Primary Buttons */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Primary Buttons</h2>
        
        {/* Regular Buttons */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 text-gray-700">With Text</h3>
          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Default</div>
              <Button variant="primary" leftIcon={<FiPlus />}>
                Add New
              </Button>
            </div>
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Hover</div>
              <Button variant="primary" leftIcon={<FiPlus />}>
                Add New
              </Button>
            </div>
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Focused</div>
              <Button variant="primary" leftIcon={<FiPlus />}>
                Add New
              </Button>
            </div>
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Disabled</div>
              <Button variant="primary" disabled leftIcon={<FiPlus />}>
                Add New
              </Button>
            </div>
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Large</div>
              <Button variant="primary" size="large" leftIcon={<FiPlus />}>
                Add New
              </Button>
            </div>
          </div>
        </div>
        
        {/* Icon Only Buttons */}
        <div>
          <h3 className="text-lg font-medium mb-4 text-gray-700">Icon Only</h3>
          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Default</div>
              <Button variant="primary" iconOnly leftIcon={<FiPlus />} aria-label="Add" />
            </div>
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Hover</div>
              <Button variant="primary" iconOnly leftIcon={<FiPlus />} aria-label="Add" />
            </div>
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Focused</div>
              <Button variant="primary" iconOnly leftIcon={<FiPlus />} aria-label="Add" />
            </div>
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Disabled</div>
              <Button variant="primary" disabled iconOnly leftIcon={<FiPlus />} aria-label="Add" />
            </div>
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Large</div>
              <Button variant="primary" size="large" iconOnly leftIcon={<FiPlus />} aria-label="Add" />
            </div>
          </div>
        </div>
      </section>

            {/* Primary Trans Buttons */}
            <section className="mb-12 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Primary Trans Buttons</h2>
        
        {/* Regular Buttons */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 text-gray-700">With Text</h3>
          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Default</div>
              <Button variant="primary-trans" leftIcon={<FiPlus />}>
                Add New
              </Button>
            </div>
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Hover</div>
              <Button variant="primary-trans" leftIcon={<FiPlus />}>
                Add New
              </Button>
            </div>
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Focused</div>
              <Button variant="primary-trans" leftIcon={<FiPlus />}>
                Add New
              </Button>
            </div>
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Disabled</div>
              <Button variant="primary-trans" disabled leftIcon={<FiPlus />}>
                Add New
              </Button>
            </div>
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Large</div>
              <Button variant="primary-trans" size="large" leftIcon={<FiPlus />}>
                Add New
              </Button>
            </div>
          </div>
        </div>
        
        {/* Icon Only Buttons */}
        <div>
          <h3 className="text-lg font-medium mb-4 text-gray-700">Icon Only</h3>
          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Default</div>
              <Button variant="primary" iconOnly leftIcon={<FiPlus />} aria-label="Add" />
            </div>
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Hover</div>
              <Button variant="primary" iconOnly leftIcon={<FiPlus />} aria-label="Add" />
            </div>
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Focused</div>
              <Button variant="primary" iconOnly leftIcon={<FiPlus />} aria-label="Add" />
            </div>
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Disabled</div>
              <Button variant="primary" disabled iconOnly leftIcon={<FiPlus />} aria-label="Add" />
            </div>
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Large</div>
              <Button variant="primary" size="large" iconOnly leftIcon={<FiPlus />} aria-label="Add" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Secondary Buttons */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Secondary Buttons</h2>
        
        {/* Regular Buttons */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 text-gray-700">With Text</h3>
          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Default</div>
              <Button variant="secondary" leftIcon={<FiDownload />}>
                Download
              </Button>
            </div>
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Hover</div>
              <Button variant="secondary" leftIcon={<FiDownload />}>
                Download
              </Button>
            </div>
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Focused</div>
              <Button variant="secondary" leftIcon={<FiDownload />}>
                Download
              </Button>
            </div>
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Disabled</div>
              <Button variant="secondary" disabled leftIcon={<FiDownload />}>
                Download
              </Button>
            </div>
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Large</div>
              <Button variant="secondary" size="large" leftIcon={<FiDownload />}>
                Download
              </Button>
            </div>
          </div>
        </div>
        
        {/* Icon Only Buttons */}
        <div>
          <h3 className="text-lg font-medium mb-4 text-gray-700">Icon Only</h3>
          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Default</div>
              <Button variant="secondary" iconOnly leftIcon={<FiDownload />} aria-label="Download" />
            </div>
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Hover</div>
              <Button variant="secondary" iconOnly leftIcon={<FiDownload />} aria-label="Download" />
            </div>
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Focused</div>
              <Button variant="secondary" iconOnly leftIcon={<FiDownload />} aria-label="Download" />
            </div>
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Disabled</div>
              <Button variant="secondary" disabled iconOnly leftIcon={<FiDownload />} aria-label="Download" />
            </div>
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Large</div>
              <Button variant="secondary" size="large" iconOnly leftIcon={<FiDownload />} aria-label="Download" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Gray Buttons */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Gray Buttons</h2>
        
        {/* Gray Primary */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 text-gray-700">Gray Primary</h3>
          
          {/* Regular Buttons */}
          <div className="mb-8">
            <h4 className="text-md font-medium mb-3 text-gray-600">With Text</h4>
            <div className="flex flex-wrap items-center gap-4">
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Default</div>
                <Button variant="grey-pri" leftIcon={<FiMoreHorizontal />}>
                  More Options
                </Button>
              </div>
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Hover</div>
                <Button variant="grey-pri" leftIcon={<FiMoreHorizontal />}>
                  More Options
                </Button>
              </div>
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Focused</div>
                <Button variant="grey-pri" leftIcon={<FiMoreHorizontal />}>
                  More Options
                </Button>
              </div>
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Disabled</div>
                <Button variant="grey-pri" disabled leftIcon={<FiMoreHorizontal />}>
                  More Options
                </Button>
              </div>
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Large</div>
                <Button variant="grey-pri" size="large" leftIcon={<FiMoreHorizontal />}>
                  More Options
                </Button>
              </div>
            </div>
          </div>
          
          {/* Icon Only Buttons */}
          <div>
            <h4 className="text-md font-medium mb-3 text-gray-600">Icon Only</h4>
            <div className="flex flex-wrap items-center gap-4">
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Default</div>
                <Button variant="grey-pri" iconOnly leftIcon={<FiMoreHorizontal />} aria-label="More options" />
              </div>
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Hover</div>
                <Button variant="grey-pri" iconOnly leftIcon={<FiMoreHorizontal />} aria-label="More options" />
              </div>
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Focused</div>
                <Button variant="grey-pri" iconOnly leftIcon={<FiMoreHorizontal />} aria-label="More options" />
              </div>
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Disabled</div>
                <Button variant="grey-pri" disabled iconOnly leftIcon={<FiMoreHorizontal />} aria-label="More options" />
              </div>
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Large</div>
                <Button variant="grey-pri" size="large" iconOnly leftIcon={<FiMoreHorizontal />} aria-label="More options" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Gray Secondary */}
        <div>
          <h3 className="text-lg font-medium mb-4 text-gray-700">Gray Secondary</h3>
          
          {/* Regular Buttons */}
          <div className="mb-8">
            <h4 className="text-md font-medium mb-3 text-gray-600">With Text</h4>
            <div className="flex flex-wrap items-center gap-4">
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Default</div>
                <Button variant="grey-sec" leftIcon={<FiMoreHorizontal />}>
                  More Actions
                </Button>
              </div>
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Hover</div>
                <Button variant="grey-sec" leftIcon={<FiMoreHorizontal />}>
                  More Actions
                </Button>
              </div>
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Focused</div>
                <Button variant="grey-sec" leftIcon={<FiMoreHorizontal />}>
                  More Actions
                </Button>
              </div>
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Disabled</div>
                <Button variant="grey-sec" disabled leftIcon={<FiMoreHorizontal />}>
                  More Actions
                </Button>
              </div>
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Large</div>
                <Button variant="grey-sec" size="large" leftIcon={<FiMoreHorizontal />}>
                  More Actions
                </Button>
              </div>
            </div>
          </div>
          
          {/* Icon Only Buttons */}
          <div>
            <h4 className="text-md font-medium mb-3 text-gray-600">Icon Only</h4>
            <div className="flex flex-wrap items-center gap-4">
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Default</div>
                <Button variant="grey-sec" iconOnly leftIcon={<FiMoreHorizontal />} aria-label="More actions" />
              </div>
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Hover</div>
                <Button variant="grey-sec" iconOnly leftIcon={<FiMoreHorizontal />} aria-label="More actions" />
              </div>
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Focused</div>
                <Button variant="grey-sec" iconOnly leftIcon={<FiMoreHorizontal />} aria-label="More actions" />
              </div>
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Disabled</div>
                <Button variant="grey-sec" disabled iconOnly leftIcon={<FiMoreHorizontal />} aria-label="More actions" />
              </div>
              <div className="space-y-4">
                <div className="font-medium text-sm text-gray-600">Large</div>
                <Button variant="grey-sec" size="large" iconOnly leftIcon={<FiMoreHorizontal />} aria-label="More actions" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Text Buttons */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Text Buttons</h2>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 text-gray-700">Default States</h3>
          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Primary</div>
              <Button variant="text-pri" leftIcon={<FiPlus />}>
                Add Item
              </Button>
            </div>
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Secondary</div>
              <Button variant="text-sec" leftIcon={<FiDownload />}>
                Download
              </Button>
            </div>
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Destructive</div>
              <Button variant="text-destructive" leftIcon={<FiTrash2 />}>
                Delete
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 text-gray-700">Hover States</h3>
          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Primary</div>
              <Button variant="text-pri" leftIcon={<FiPlus />}>
                Add Item
              </Button>
            </div>
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Secondary</div>
              <Button variant="text-sec" leftIcon={<FiDownload />}>
                Download
              </Button>
            </div>
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Destructive</div>
              <Button variant="text-destructive" leftIcon={<FiTrash2 />}>
                Delete
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 text-gray-700">Focused States</h3>
          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Primary</div>
              <Button variant="text-pri" leftIcon={<FiPlus />}>
                Add Item
              </Button>
            </div>
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Secondary</div>
              <Button variant="text-sec" leftIcon={<FiDownload />}>
                Download
              </Button>
            </div>
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Destructive</div>
              <Button variant="text-destructive" leftIcon={<FiTrash2 />}>
                Delete
              </Button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4 text-gray-700">Disabled States</h3>
          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Primary</div>
              <Button variant="text-pri" disabled leftIcon={<FiPlus />}>
                Add Item
              </Button>
            </div>
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Secondary</div>
              <Button variant="text-sec" disabled leftIcon={<FiDownload />}>
                Download
              </Button>
            </div>
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-600">Destructive</div>
              <Button variant="text-destructive" disabled leftIcon={<FiTrash2 />}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ButtonDemo;

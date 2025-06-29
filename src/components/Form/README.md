# Form Components

A collection of reusable form components built with React and Tailwind CSS, following the CONTRAk'TOR Design System.

## Installation

```bash
npm install
```

## Available Components

### 1. Button
A highly customizable button component with support for multiple variants, sizes, and states.

#### Variants
- `primary`: Primary action button
- `secondary`: Secondary action button with border
- `destructive-pri`: Primary destructive action
- `destructive-sec`: Secondary destructive action
- `grey-pri`: Primary gray button
- `grey-sec`: Secondary gray button
- `text-pri`: Text button (primary)
- `text-sec`: Text button (secondary)
- `text-destructive`: Text button (destructive)

#### Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `variant` | string | No | 'primary' | Button style variant |
| `size` | string | No | 'small' | Button size ('small' or 'large') |
| `disabled` | boolean | No | false | Disable the button |
| `loading` | boolean | No | false | Show loading state |
| `leftIcon` | ReactNode | No | - | Icon to display on the left |
| `rightIcon` | ReactNode | No | - | Icon to display on the right |
| `iconOnly` | boolean | No | false | Show only icon (no text) |
| `type` | string | No | 'button' | Button type ('button', 'submit', 'reset') |
| `className` | string | No | - | Additional CSS classes |

#### Usage Example
```jsx
import Button from './components/Button/Button';
import { FiDownload, FiUpload } from 'react-icons/fi';

function ButtonExample() {
  return (
    <div className="space-x-4">
      <Button variant="primary">Primary Button</Button>
      <Button variant="secondary" size="large">Large Button</Button>
      <Button 
        variant="primary" 
        leftIcon={<FiDownload />}
        loading={isLoading}
      >
        Download
      </Button>
      <Button 
        variant="text-pri" 
        rightIcon={<FiUpload />}
        disabled={isDisabled}
      >
        Upload
      </Button>
    </div>
  );
}
```

### 2. TextInput
A versatile text input field with support for various states and configurations.

#### Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `id` | string | No | - | Unique identifier |
| `name` | string | No | - | Name attribute |
| `label` | string | No | - | Input label |
| `value` | string | No | - | Controlled value |
| `onChange` | function | Yes | - | Change handler |
| `type` | string | No | 'text' | Input type (text, password, email, etc.) |
| `disabled` | boolean | No | false | Disable the input |
| `readOnly` | boolean | No | false | Make input read-only |
| `isError` | boolean | No | false | Show error state |
| `isSuccess` | boolean | No | false | Show success state |
| `errorMessage` | string | No | - | Error message to display |
| `successMessage` | string | No | - | Success message to display |
| `helperText` | string | No | - | Helper/description text |
| `leadingIcon` | ReactNode | No | - | Icon to display on the left |
| `trailingIcon` | ReactNode | No | - | Icon to display on the right |
| `onTrailingIconClick` | function | No | - | Click handler for trailing icon |

### 2. Select
A customizable select dropdown component.

#### Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | string | No | - | Select label |
| `value` | string | Yes | - | Selected value |
| `onChange` | function | Yes | - | Change handler |
| `options` | Array | Yes | - | Array of options |
| `placeholder` | string | No | - | Placeholder text |
| `error` | string | No | - | Error message |
| `disabled` | boolean | No | false | Disable the select |
| `required` | boolean | No | false | Mark as required |
| `showIcon` | boolean | No | true | Show leading icon |

### 3. Checkbox
A customizable checkbox input.

#### Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | string | No | - | Checkbox label |
| `checked` | boolean | Yes | - | Checked state |
| `onChange` | function | Yes | - | Change handler |
| `disabled` | boolean | No | false | Disable the checkbox |
| `required` | boolean | No | false | Mark as required |

### 4. Radio & RadioGroup
A group of radio buttons that work together.

#### RadioGroup Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | string | No | - | Group label |
| `name` | string | Yes | - | Name attribute for all radios |
| `value` | string | No | - | Selected value |
| `onChange` | function | Yes | - | Change handler |
| `options` | Array | Yes | - | Array of radio options |
| `disabled` | boolean | No | false | Disable all radios |
| `required` | boolean | No | false | Mark as required |
| `error` | string | No | - | Error message |
| `helperText` | string | No | - | Helper/description text |

## Usage Example

```jsx
import { TextInput, Select, Checkbox, RadioGroup } from './components/Form';

function MyForm() {
  const [formData, setFormData] = useState({
    username: '',
    role: '',
    agree: false,
    notification: 'email',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <TextInput
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Enter your username"
        required
      />
      
      <Select
        label="Role"
        name="role"
        value={formData.role}
        onChange={handleChange}
        options={[
          { value: 'admin', label: 'Administrator' },
          { value: 'user', label: 'Regular User' },
          { value: 'guest', label: 'Guest' },
        ]}
        placeholder="Select a role"
        className="mt-4"
      />
      
      <Checkbox
        label="I agree to the terms and conditions"
        name="agree"
        checked={formData.agree}
        onChange={handleChange}
        className="mt-4"
      />
      
      <RadioGroup
        label="Notification Preference"
        name="notification"
        value={formData.notification}
        onChange={handleChange}
        options={[
          { value: 'email', label: 'Email' },
          { value: 'sms', label: 'SMS' },
          { value: 'none', label: 'None' },
        ]}
        className="mt-4"
      />
    </div>
  );
}
```

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

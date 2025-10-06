import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Button from '../src/components/Button.vue';

describe('Button', () => {
  it('renders button with default props', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click me'
      }
    });

    expect(wrapper.text()).toBe('Click me');
    expect(wrapper.classes()).toContain('btn');
    expect(wrapper.classes()).toContain('btn--primary');
    expect(wrapper.classes()).toContain('btn--md');
  });

  it('applies variant classes correctly', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'danger'
      },
      slots: {
        default: 'Delete'
      }
    });

    expect(wrapper.classes()).toContain('btn--danger');
  });

  it('shows loading spinner when loading', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true
      },
      slots: {
        default: 'Submit'
      }
    });

    expect(wrapper.find('.btn__spinner').exists()).toBe(true);
    expect(wrapper.text()).not.toBe('Submit');
    expect(wrapper.attributes('disabled')).toBeDefined();
  });

  it('emits click event when clicked', async () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click me'
      }
    });

    await wrapper.trigger('click');
    expect(wrapper.emitted().click).toBeTruthy();
    expect(wrapper.emitted().click).toHaveLength(1);
  });

  it('is disabled when disabled prop is true', () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true
      },
      slots: {
        default: 'Disabled'
      }
    });

    expect(wrapper.attributes('disabled')).toBeDefined();
  });
});

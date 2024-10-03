// Packages
import React, { useRef, useState } from 'react';
import noop from 'lodash/noop';
import PlitziSdk, { PlitziServiceProvider } from '@plitzi/plitzi-sdk';

// Relatives
import Demo from './Demo';
import Settings from './Settings';

export default {
  title: 'Example/Demo',
  decorators: [],
  component: Demo,
  argTypes: {}
};

const schema = {
  settings: {
    title: 'Default',
    customCss: ''
  },
  flat: {
    '5f544375ced80ed16f382b7b': {
      attributes: {
        name: 'Home'
      },
      builder: {
        itemsAllowed: [],
        itemsNotAllowed: []
      },
      definition: {
        label: 'Page',
        type: 'page',
        slug: '',
        items: ['5f47e7ca8294097d8b0a1715'],
        styleSelectors: {
          base: ''
        }
      },
      id: '5f544375ced80ed16f382b7b'
    },
    '5f47e7ca8294097d8b0a1715': {
      id: '5f47e7ca8294097d8b0a1715',
      attributes: {
        content: 'Testing'
      },
      definition: {
        label: 'Demo',
        type: 'demo',
        description: '',
        parentId: '5f544375ced80ed16f382b7b',
        styleSelectors: {
          base: ''
        }
      }
    }
  },
  pages: ['5f544375ced80ed16f382b7b']
};

export const WithHoc = () => (
  <PlitziSdk offlineMode offlineData={{ schema }}>
    <PlitziSdk.Plugin
      renderType="demo"
      component={Demo}
      assets={[
        {
          type: 'text/css',
          href: '/main.css',
          rel: 'stylesheet'
        }
      ]}
    />
  </PlitziSdk>
);

export const WithHocNoPreview = () => (
  <PlitziSdk offlineMode offlineData={{ schema }} previewMode={false}>
    <PlitziSdk.Plugin
      renderType="demo"
      component={Demo}
      assets={[
        {
          type: 'text/css',
          href: '/main.css',
          rel: 'stylesheet'
        }
      ]}
    />
  </PlitziSdk>
);

export const WithHocNoIframe = () => (
  <PlitziSdk offlineMode renderMode="raw" offlineData={{ schema }}>
    <PlitziSdk.Plugin renderType="demo" component={Demo} />
  </PlitziSdk>
);

export const ComponentRender = () => {
  const ref = useRef();

  return (
    <PlitziServiceProvider
      value={{
        settings: { previewMode: true }
      }}
    >
      <Demo ref={ref} />
    </PlitziServiceProvider>
  );
};

ComponentRender.args = {
  className: '',
  internalProps: {},
  content: 'Demo Component'
};

export const ComponentSettings = args => {
  const [props, setProps] = useState({});

  const onUpdate = (key, value) => {
    setProps(state => ({ ...state, [key]: value }));
  };

  return <Settings {...args} {...props} onUpdate={onUpdate} />;
};

ComponentSettings.args = {
  content: '',
  onUpdate: noop
};

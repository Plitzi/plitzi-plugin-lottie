// Relatives
import Demo from './Demo';
import DemoChild from './DemoChild';
import Settings from './Settings';

Demo.type = 'demo';
Demo.pluginSettings = Settings;
Demo.version = VERSION;

export const plugins = { demoChild: DemoChild };

export const version = VERSION;

export default Demo;

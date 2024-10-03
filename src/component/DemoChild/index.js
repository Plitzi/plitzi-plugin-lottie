// Relatives
import DemoChild from './DemoChild';
import Settings from './Settings';

DemoChild.type = 'demoChild';
DemoChild.pluginSettings = Settings;
DemoChild.version = VERSION;

export const plugins = {};

export const version = VERSION;

export default DemoChild;

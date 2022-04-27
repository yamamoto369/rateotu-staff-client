import * as developmentSettings from './development';
import * as productionSettings from './production';

const settings = process.env.NODE_ENV === 'development' ? developmentSettings : productionSettings;
export default settings;

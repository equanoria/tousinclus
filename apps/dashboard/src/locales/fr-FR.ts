import type { Locale } from 'antd/es/locale';
import frFR from 'antd/locale/fr_FR';
import deepmerge from 'deepmerge';

const override = {
  Form: {
    optional: '(facultatif)',
  },
};

export const fr_FR_OVERRIDE: Locale = deepmerge(frFR, override);

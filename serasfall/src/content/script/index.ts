import prolog from './prolog';
import k1_main from './k1_main';
import k1_talk from './k1_talk';
import k2_main from './k2_main';
import k2_talk from './k2_talk';
import k3_main from './k3_main';
import k3_talk from './k3_talk';
import k4_main from './k4_main';
import k4_talk from './k4_talk';
import k5_main from './k5_main';
import epilog from './epilog';
import examine from './examine';
import yuumi from './yuumi';
import present from './present';

export const SCRIPTS: Record<string, string> = {
  prolog, k1_main, k1_talk, k2_main, k2_talk, k3_main, k3_talk, k4_main, k4_talk, k5_main, epilog, examine, yuumi, present,
};

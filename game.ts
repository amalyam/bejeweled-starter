import "source-map-support/register";

import Bejeweled from "./class/bejeweled";

const bejeweled = new Bejeweled();

const useSampleData = !!process.env.SAMPLE_DATA;

bejeweled.run({ useSampleData });

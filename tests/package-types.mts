import fit, { type ModelFitResult, type FullFitReport, type HardwareProfile } from 'browser-llm-fit';
const result: ModelFitResult = await fit('SmolLM2-135M');
const fits: boolean = result.fits;
const hardware: HardwareProfile = result.hardware;
const report: FullFitReport = await fit();
const simulated: FullFitReport = await fit(undefined, { ram: 4 });
const maybeName: string | undefined = Math.random() > 0.5 ? 'SmolLM2-135M' : undefined;
const union: ModelFitResult | FullFitReport = await fit(maybeName);
void [fits, hardware, report, simulated, union];
// @ts-expect-error Model results do not expose the full catalog.
void result.models;
// @ts-expect-error Hardware exports must retain their concrete types.
const invalidRam: string = hardware.estimatedRamGB;
void invalidRam;

export class VmConfig {
  id: number;
  teamId: number;
  groupName: string;
  maxCpu: number;
  maxRam: number;
  maxDisk: number;
  maxVm: number;
  maxActive: number;

  constructor(id: number, teamId: number, groupName: string, maxCpu: number,
              maxRam: number, maxDisk: number, maxVm: number, maxActive: number) {
    this.id = id;
    this.teamId = teamId;
    this.groupName = groupName;
    this.maxCpu = maxCpu;
    this.maxRam = maxRam;
    this.maxDisk = maxDisk;
    this.maxVm = maxVm;
    this.maxActive = maxActive;
  }
}

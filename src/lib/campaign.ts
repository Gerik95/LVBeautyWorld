/**
 * Time-boxed salon offers. One offer at a time, shown on top of any skin
 * (winter stays on). `ThemeScript` sets `<html data-campaign>` before paint
 * from the visitor's clock, so the markup is always rendered and CSS shows it.
 * `?<id>` in the address previews an offer outside its dates.
 */
export type Campaign = {
  id: string;
  code: string;
  /** ISO time with offset, Europe/Berlin. Inclusive. */
  start: string;
  /** ISO time with offset, Europe/Berlin. Exclusive. */
  end: string;
};

/** 10 % off with LVBLACK, Mon 23.11.2026 – Sun 29.11.2026, for appointments in January and February. */
export const blackWeek: Campaign = {
  id: "blackweek",
  code: "LVBLACK",
  start: "2026-11-23T00:00:00+01:00",
  end: "2026-11-30T00:00:00+01:00",
};

export const campaigns: readonly Campaign[] = [blackWeek];

export const isCampaignLive = (campaign: Campaign, now: number) =>
  now >= Date.parse(campaign.start) && now < Date.parse(campaign.end);

export const liveCampaign = (now: number, search = "") => {
  const params = new URLSearchParams(search);
  return campaigns.find((campaign) => params.has(campaign.id) || isCampaignLive(campaign, now)) ?? null;
};

/** Plain ES5 for the inline head script. */
export const campaignScript = () =>
  `var cs=${JSON.stringify(campaigns.map(({ id, start, end }) => [id, Date.parse(start), Date.parse(end)]))};` +
  `var cn=Date.now(),cq=location.search;` +
  `for(var ci=0;ci<cs.length;ci++){var c=cs[ci];` +
  `if(new RegExp('[?&]'+c[0]+'(=|&|$)').test(cq)||(cn>=c[1]&&cn<c[2])){e.dataset.campaign=c[0];break;}}`;

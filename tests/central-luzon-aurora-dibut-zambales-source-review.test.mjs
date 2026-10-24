import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const base=new URL("../data/research/philippines/",import.meta.url);
const [aurora,zambales,checkpoint,registry]=await Promise.all([
 "central-luzon-aurora-dibut-river-source-review-20261024.json",
 "central-luzon-zambales-masinloc-oyon-bay-report-source-review-20261024.json",
 "central-luzon-discovery-checkpoint-20261024.json","sources.json"
].map(n=>readFile(new URL(n,base),"utf8").then(JSON.parse)));

test("Dibut River remains a bounded upper-to-tidal historical study with the source count conflict intact",()=>{
 assert.equal(aurora.site.waterbody,"Dibut River");assert.equal(aurora.site.stations.length,3);
 assert.equal(aurora.site.stations[0].latitudeDms,"15\u00b045\u203218.43\u2033 N");
 assert.equal(aurora.reportedEvidence.abstractSpeciesCount,22);assert.equal(aurora.reportedEvidence.resultsSpeciesCount,23);
 assert.equal(aurora.reportedEvidence.conclusionSpeciesCount,23);assert.equal(aurora.reportedEvidence.table1ListedTaxonRows,22);
 assert.match(aurora.site.stations[0].reach,/freshwater\/saltwater/);assert.match(aurora.methods.identification,/DNA barcoding/);
 assert.equal(aurora.disposition.publicSpeciesAssertionsAdded,0);assert.equal(aurora.disposition.appProjectionRowsAdded,0);
});

test("Dibut article reuse remains held without an article-level license",()=>{
 assert.equal(aurora.rights.articleSpecificLicense.startsWith("No article-specific"),true);
 assert.match(aurora.rights.journalLevelMetadata,/not treated as a confirmed article-specific grant/);
 assert.equal(aurora.rights.disposition.includes("unresolved"),true);
 const s=registry.sources.find(x=>x.id===aurora.source.id);assert.ok(s);assert.equal(s.license,null);assert.equal(s.publicationApproval,false);
});

test("Zambales reef totals remain landing-page leads behind the login gate",()=>{
 assert.deepEqual(zambales.scope.fishCountAsReported,{species:254,families:35,highestReportedSite:{name:"Taklobo MPA",species:102},lowestReportedSite:{name:"Panglit MPA",species:63}});
 assert.equal(zambales.access.loginAttempted,false);assert.equal(zambales.access.reportDownloaded,false);
 assert.equal(zambales.access.speciesNamesReviewed,0);assert.equal(zambales.disposition.appProjectionRowsAdded,0);
 const lead=checkpoint.waterbodyLeads.coastalAndMarine.find(x=>x.name.startsWith("Masinloc-Oyon Bay"));assert.ok(lead);
 assert.deepEqual(lead.administrativeUnits,["Zambales"]);
 const s=registry.sources.find(x=>x.id===zambales.source.id);assert.ok(s);assert.equal(s.license,null);assert.equal(s.publicationApproval,false);
});

test("Both province leads preserve the incomplete Central Luzon research checkpoint",()=>{
 assert.equal(checkpoint.status,"discovery-checkpoint-incomplete");
 assert.equal(checkpoint.auroraDibutRiverSourceReviewFile,"central-luzon-aurora-dibut-river-source-review-20261024.json");
 assert.equal(checkpoint.zambalesMasinlocOyonBayReviewFile,"central-luzon-zambales-masinloc-oyon-bay-report-source-review-20261024.json");
 assert.match(checkpoint.nextStep.action,/Bulacan freshwater/);assert.match(checkpoint.nextStep.action,/four country-level GenBank checks/);
 assert.equal(registry.sourceCount,registry.sources.length);
});

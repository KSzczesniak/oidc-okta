export class AllowedFeatures {
    constructor(
        public depot = false,
        public depotAdministration = false,
        public codeplugRepository = false,
        public codeplugRequirement = false,
        public codeplugRequirementAdministration = false,
        public flashcodeManagement = false,
        public flashcodeManagementAdministration = false,
    ) {}
}
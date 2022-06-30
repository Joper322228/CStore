public with sharing class uploadProductImages {

    @AuraEnabled
    public static List<ContentVersion> getVersionFiles(String recordId){
        
            return [
                SELECT
                Id,
                Title,
                ContentDocumentId,
                FileType, 
                ContentSize,
                FileExtension,
                VersionNumber,
                CreatedDate,
                VersionData,
                FirstPublishLocationId
                FROM ContentVersion
                WHERE FirstPublishLocationId =:recordId
                ORDER BY CreatedDate DESC
		    ];
        
    }

}

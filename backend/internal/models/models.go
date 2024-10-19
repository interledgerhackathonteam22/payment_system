package models


type GetWalletResp struct {
	ID             string `json:"id"`
	PublicName     string `json:"publicName"`
	AssetCode      string `json:"assetCode"`
	AssetScale     int    `json:"assetScale"`
	AuthServer     string `json:"authServer"`
	ResourceServer string `json:"resourceServer"`
}




import { Injectable } from '@nestjs/common';

@Injectable()
export class FormatterService {

    // Formatter permettant une meilleur lisibilité des JSON
    async usersFormatter(usersData: any) {
        return usersData.map((user: any) => ({
            image: user.image,
            handicap_category: {
                icon: user.handicap_category?.icon || null,
                category_name: user.handicap_category?.translations?.[0]?.category_name || null,
            },
            description: user.translations?.[0]?.description || null,
        }));
    }

    async situationsFormatter(situationsData: any) {
        if (Array.isArray(situationsData)) {
            return situationsData.map((situation: any) => ({
                image: situation.image,
                context: situation.context_translations?.[0]?.context || null,
                description: situation.description_translations?.[0]?.description || null,
            }));
        } else if (situationsData && typeof situationsData === 'object') {
            // Si c'est un objet unique, le formater directement
            return {
                image: situationsData.image,
                context: situationsData.context_translations?.[0]?.context || null,
                description: situationsData.description_translations?.[0]?.description || null,
            };
        }
        return null; // Si les données sont null ou non valides
    }

    async designFormatter(designData: any) {
        return designData.map((design: any) => ({
            image: design.image,
            principle_category: {
                icon: design.principle_category?.icon || null,
                category_name: design.principle_category?.translations?.[0]?.category_name || null,
            },
            description: design.translations?.[0]?.description || null,
        }));
    }

    // Formatter pour les groupes
    async groupFormatter(groupData: any) {
        return Promise.all(
            groupData.map(async (group: any) => {
                // Formattage de usage_situation
                const usage_situation = group.usage_situation
                    ? (await this.situationsFormatter([group.usage_situation]))[0]
                    : null;

                // Extraction des utilisateurs extrêmes
                const extremeUsers = group.extreme_user.map((extreme: any) => extreme.cards_users_id);

                // Formattage des utilisateurs extrêmes
                const extreme_user = await this.usersFormatter(extremeUsers);

                return {
                    title: group.translations?.[0]?.title || null,
                    usage_situation,
                    extreme_user,
                };
            }),
        );
    }

}